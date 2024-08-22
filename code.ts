
import { generateCSS } from './cssGenerator';
import { setConfig, getConfig, CSSGeneratorConfig } from './config';
import { ExtractedData, CodegenResultLanguage, CustomCodegenResult } from './types';
import { exportToHTML, exportToXML, exportToJSON } from './structureExporter';
import { isValidCodegenResult, generateSlug } from './utils'

const BATCH_SIZE = 100;

figma.showUI(__html__, { width: 300, height: 450 });

async function processNodesInBatches(nodes: ReadonlyArray<SceneNode>): Promise<ExtractedData[]> {
  let allExtractedData: ExtractedData[] = [];
  const totalNodes = nodes.length;

  for (let i = 0; i < totalNodes; i += BATCH_SIZE) {
    const batch = nodes.slice(i, Math.min(i + BATCH_SIZE, totalNodes));
    const batchData = await Promise.all(batch.map(processNodeAndChildren));
    
    allExtractedData = allExtractedData.concat(batchData);

    const progress = Math.min(100, ((i + BATCH_SIZE) / totalNodes) * 100);
    figma.ui.postMessage({
      type: 'progress-update',
      progress: progress,
      currentBatch: i / BATCH_SIZE + 1,
      totalBatches: Math.ceil(totalNodes / BATCH_SIZE)
    });

    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return allExtractedData;
}

async function processNodeAndChildren(node: SceneNode): Promise<ExtractedData> {
  const config = getConfig();
  const css = generateCSS(node, config);
  const data: ExtractedData = {
    id: node.id,
    name: node.name,
    type: node.type,
    css: css,
    properties: {}, // Add properties if needed
    children: []
  };

  if ('children' in node) {
    data.children = await Promise.all((node.children as SceneNode[]).map(processNodeAndChildren));
  }

  return data;
}


figma.ui.onmessage = async (msg: { type: string; config?: Partial<CSSGeneratorConfig> }) => {
  if (msg.type === 'set-config' && msg.config) {
    setConfig(msg.config);
    figma.ui.postMessage({ type: 'config-updated' });
  } else if (msg.type === 'generate-code') {
    const nodes = figma.currentPage.selection;
    if (nodes.length === 0) {
      figma.ui.postMessage({ type: 'code-generated', code: '// No nodes selected' });
      return;
    }

    figma.ui.postMessage({ type: 'generation-started', nodeCount: nodes.length });

    const extractedData = await processNodesInBatches(nodes);
    const config = getConfig();
    let generatedCode = '';

    const generateCodeRecursively = (data: ExtractedData, depth: number = 0) => {
      const indent = '  '.repeat(depth);
      generatedCode += `${indent}/* ${data.name} */\n${indent}${data.css}\n\n`;
      if (data.children && data.children.length > 0) {
        data.children.forEach(child => generateCodeRecursively(child, depth + 1));
      }
    };

    extractedData.forEach(data => generateCodeRecursively(data));

    if (config.exportFormat !== 'none' && nodes.length > 0) {
      let structureCode = '';
      switch (config.exportFormat) {
        case 'html':
          structureCode = nodes.map(node => {
            const slug = generateSlug(node.name);
            return `<div class="figma-page ${slug}">\n${exportToHTML(node, slug)}\n</div>`;
          }).join('\n\n');
          break;
        case 'xml':
          structureCode = '<?xml version="1.0" encoding="UTF-8"?>\n<figma-structure>\n' +
            nodes.map(node => {
              const slug = generateSlug(node.name);
              return exportToXML(node, slug);
            }).join('\n') +
            '</figma-structure>';
          break;
        case 'json':
          structureCode = JSON.stringify(nodes.map(node => {
            const slug = generateSlug(node.name);
            return exportToJSON(node, slug);
          }), null, 2);
          break;
      }
      generatedCode += `/* Structure Export (${config.exportFormat.toUpperCase()}) */\n${structureCode}\n`;
    }

    figma.ui.postMessage({ type: 'code-generated', code: generatedCode });
    figma.ui.postMessage({ type: 'generation-complete' });
  }
};

figma.codegen.on('generate', async (event: CodegenEvent): Promise<CodegenResult[]> => {
  const nodes = event.node ? [event.node] : figma.currentPage.selection;

  if (nodes.length === 0) {
    return [{
      title: 'No nodes selected',
      code: '// Please select one or more nodes to generate CSS',
      language: 'CSS'
    }];
  }

  try {
    figma.ui.postMessage({ type: 'generation-started', nodeCount: nodes.length });

    const extractedData = await processNodesInBatches(nodes);
    const config = getConfig();

    const generatedCode: CustomCodegenResult[] = extractedData.map(data => {
      const slug = generateSlug(data.name);
      const scopedCSS = data.css.split('\n').map(line => {
        if (line.trim().endsWith('{')) {
          return `.${slug} ${line}`;
        }
        return line;
      }).join('\n');

      return {
        title: `CSS for ${data.name}`,
        code: scopedCSS,
        language: 'CSS'
      };
    });

    if (config.exportFormat !== 'none' && nodes.length > 0) {
      let structureCode = '';
      let language: CodegenResultLanguage;
      switch (config.exportFormat) {
        case 'html':
          structureCode = nodes.map(node => {
            const slug = generateSlug(node.name);
            return `<div class="figma-page ${slug}">\n${exportToHTML(node, slug)}\n</div>`;
          }).join('\n\n');
          language = 'HTML';
          break;
        case 'xml':
          structureCode = '<?xml version="1.0" encoding="UTF-8"?>\n<figma-structure>\n' +
            nodes.map(node => {
              const slug = generateSlug(node.name);
              return exportToXML(node, slug);
            }).join('\n') +
            '</figma-structure>';
          language = 'XML';
          break;
        case 'json':
          structureCode = JSON.stringify(nodes.map(node => {
            const slug = generateSlug(node.name);
            return exportToJSON(node, slug);
          }), null, 2);
          language = 'JSON';
          break;
        default:
          language = 'PLAINTEXT';
      }
      generatedCode.push({
        title: `Structure Export (${config.exportFormat.toUpperCase()})`,
        code: structureCode,
        language
      });
    }

    figma.ui.postMessage({ type: 'generation-complete' });

    return generatedCode.filter(isValidCodegenResult);
  } catch (error) {
    console.error('Error during code generation:', error);
    return [{
      title: 'Error',
      code: `// An error occurred during code generation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      language: 'PLAINTEXT'
    }];
  }
});
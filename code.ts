import { generateCSS } from './cssGenerator';
import { setConfig, getConfig, CSSGeneratorConfig } from './config';
import { ExtractedData, CustomCodegenResult } from './types';
import { exportToHTML, exportToXML, exportToJSON } from './structureExporter';
import { isValidCodegenResult, generateSlug } from './utils';

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
  const { css, nestedCSS } = generateCSS(node, config);
  const data: ExtractedData = {
    id: node.id,
    name: node.name,
    type: node.type,
    css: {
      main: css,
      nested: nestedCSS
    },
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
    let cssCode = '';
    let htmlCode = '';
    let structureCode = '';

    extractedData.forEach(data => {
      const slug = generateSlug(data.name);
      cssCode += `.${slug} {\n${data.css.main}}\n\n`;
      Object.entries(data.css.nested).forEach(([nestedSlug, nestedCSS]) => {
        cssCode += `.${slug} .${nestedSlug} {\n${nestedCSS}}\n\n`;
      });

      htmlCode += exportToHTML(data);
    });

    let generatedCode = `/* CSS */\n${cssCode}\n/* HTML */\n${htmlCode}`;

    if (config.exportFormat !== 'none' && config.exportFormat !== 'html') {
      switch (config.exportFormat) {
        case 'xml':
          structureCode = '<?xml version="1.0" encoding="UTF-8"?>\n<figma-structure>\n' +
            extractedData.map(data => exportToXML(data)).join('\n') +
            '</figma-structure>';
          break;
        case 'json':
          structureCode = JSON.stringify(
            extractedData.map(data => exportToJSON(data)),
            null,
            2
          );
          break;
      }
      if (structureCode) {
        generatedCode += `\n/* Structure Export (${config.exportFormat.toUpperCase()}) */\n${structureCode}`;
      }
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

    let cssCode = '';
    let htmlCode = '';
    let structureCode = '';

    extractedData.forEach(data => {
      const slug = generateSlug(data.name);
      cssCode += `.${slug} {\n${data.css.main}}\n\n`;
      Object.entries(data.css.nested).forEach(([nestedSlug, nestedCSS]) => {
        cssCode += `.${slug} .${nestedSlug} {\n${nestedCSS}}\n\n`;
      });

      htmlCode += exportToHTML(data);
    });

    const generatedCode: CustomCodegenResult[] = [
      {
        title: 'CSS',
        code: cssCode,
        language: 'CSS'
      },
      {
        title: 'HTML',
        code: htmlCode,
        language: 'HTML'
      }
    ];

    if (config.exportFormat !== 'none' && config.exportFormat !== 'html') {
      switch (config.exportFormat) {
        case 'xml':
          structureCode = '<?xml version="1.0" encoding="UTF-8"?>\n<figma-structure>\n' +
            extractedData.map(data => exportToXML(data)).join('\n') +
            '</figma-structure>';
          generatedCode.push({
            title: 'Structure Export (XML)',
            code: structureCode,
            language: 'XML'
          });
          break;
        case 'json':
          structureCode = JSON.stringify(
            extractedData.map(data => exportToJSON(data)),
            null,
            2
          );
          generatedCode.push({
            title: 'Structure Export (JSON)',
            code: structureCode,
            language: 'JSON'
          });
          break;
      }
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
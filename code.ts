/// <reference types="@figma/plugin-typings" />


import { generateCSS } from './cssGenerator';
import { setConfig, getConfig, CSSGeneratorConfig } from './config';
import { ExtractedData } from './types';

const BATCH_SIZE = 100;

figma.showUI(__html__);

async function processNodesInBatches(nodes: ReadonlyArray<SceneNode>): Promise<ExtractedData[]> {
  let allExtractedData: ExtractedData[] = [];
  const totalNodes = nodes.length;

  for (let i = 0; i < totalNodes; i += BATCH_SIZE) {
    const batch = nodes.slice(i, Math.min(i + BATCH_SIZE, totalNodes));
    const batchData = await Promise.all(batch.map(processNode));
    
    allExtractedData = allExtractedData.concat(batchData);

    const progress = Math.min(100, ((i + BATCH_SIZE) / totalNodes) * 100);
    figma.ui.postMessage({
      type: 'progress-update',
      progress: progress,
      currentBatch: i / BATCH_SIZE + 1,
      totalBatches: Math.ceil(totalNodes / BATCH_SIZE)
    });

    // Optional: Add a small delay to allow UI updates and prevent blocking
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return allExtractedData;
}

async function processNode(node: SceneNode): Promise<ExtractedData> {
  const config = getConfig();
  const css = generateCSS(node, config);
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    css: css,
    properties: {}, // Add an empty object for now, fill with actual properties if needed
  };
}

figma.ui.onmessage = (msg: { type: string; config?: Partial<CSSGeneratorConfig> }) => {
  if (msg.type === 'set-config' && msg.config) {
    setConfig(msg.config);
    figma.ui.postMessage({ type: 'config-updated' });
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

    const generatedCode = extractedData.map(data => ({
      title: `CSS for ${data.name}`,
      code: data.css,
      language: 'CSS' as const
    }));

    figma.ui.postMessage({ type: 'generation-complete' });

    return generatedCode;
  } catch (error) {
    console.error('Error during code generation:', error);
    return [{
      title: 'Error',
      code: `// An error occurred during code generation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      language: 'CSS' as const
    }];
  }
});
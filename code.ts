import { processNode } from './nodeProcessor';
import { FigmaNode } from './types';

figma.showUI(__html__);

figma.ui.onmessage = async (msg: { type: string }) => {
  if (msg.type === 'extract-data') {
    const selection = figma.currentPage.selection;
    let nodes: ReadonlyArray<FigmaNode>;

    if (selection.length > 0) {
      nodes = selection;
    } else {
      nodes = figma.currentPage.children;
    }

    try {
      const totalNodes = nodes.length;
      let processedNodes = 0;

      const extractedData = await Promise.all(nodes.map(async (node) => {
        const result = await processNode(node);
        processedNodes++;
        figma.ui.postMessage({
          type: 'progress-update',
          progress: (processedNodes / totalNodes) * 100
        });
        return result;
      }));

      figma.ui.postMessage({
        type: 'extraction-complete',
        data: extractedData,
      });
    } catch (error) {
      console.error('Error during data extraction:', error);
      figma.ui.postMessage({
        type: 'extraction-error',
        message: 'An error occurred during data extraction. Please try again.'
      });
    }
  }
};
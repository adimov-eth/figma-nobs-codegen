import { FigmaNode, ExtractedData } from './types';
import { extractProperties } from './propertyExtractor';
import { generateCSS } from './cssGenerator';

export async function processNode(node: FigmaNode): Promise<ExtractedData> {
  const baseData: ExtractedData = {
    id: node.id,
    name: node.name,
    type: node.type,
    properties: extractProperties(node),
    css: generateCSS(node),
  };

  if ('children' in node) {
    baseData.children = await Promise.all(node.children.map(processNode));
  }

  return baseData;
}
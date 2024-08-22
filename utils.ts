import { FigmaNode } from './types';

export function rgbaToString(color: RGBA, opacity: number = 1): string {
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity})`;
  }


export function isTextNode(node: FigmaNode): node is TextNode {
    return node.type === 'TEXT';
  }
  
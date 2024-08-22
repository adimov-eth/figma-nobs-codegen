import { FigmaNode } from './types';

export function generateCSS(node: FigmaNode): string {
  let css = '';

  if ('x' in node && 'y' in node) {
    css += `position: absolute;\n`;
    css += `left: ${node.x}px;\n`;
    css += `top: ${node.y}px;\n`;
  }
  if ('width' in node && 'height' in node) {
    css += `width: ${node.width}px;\n`;
    css += `height: ${node.height}px;\n`;
  }

  switch (node.type) {
    case 'RECTANGLE':
    case 'ELLIPSE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR':
    case 'LINE':
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
    case 'GROUP':
        css += generateShapeCSS(node as unknown as Extract<FigmaNode, {fills?: readonly Paint[], strokes?: readonly Paint[]}>);
        break;
        case 'TEXT':
        css += generateTextCSS(node as Extract<FigmaNode, TextNode>);
        break;
      break;
    // Add cases for other node types as needed
  }

  return css;
}

function generateShapeCSS(node: Extract<FigmaNode, {fills?: readonly Paint[], strokes?: readonly Paint[]}>): string {
  let css = '';

  if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      css += `background-color: rgba(${Math.round(fill.color.r * 255)}, ${Math.round(fill.color.g * 255)}, ${Math.round(fill.color.b * 255)}, ${fill.opacity || 1});\n`;
    }
  }
  if ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    if (stroke.type === 'SOLID' && 'strokeWeight' in node) {
      css += `border: ${String(node.strokeWeight)}px solid rgba(${Math.round(stroke.color.r * 255)}, ${Math.round(stroke.color.g * 255)}, ${Math.round(stroke.color.b * 255)}, ${String(stroke.opacity ?? '1')});\n`;
    }
  }
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
    css += `border-radius: ${node.cornerRadius}px;\n`;
  }

  return css;
}

function generateTextCSS(node: Extract<FigmaNode, TextNode>): string {
  let css = '';

  if (node.fontName !== figma.mixed) {
    css += `font-family: ${String(node.fontName.family)};\n`;
    css += `font-weight: ${String(node.fontName.style)};\n`;
  }
  if (typeof node.fontSize === 'number') {
    css += `font-size: ${node.fontSize}px;\n`;
  }
  css += `text-align: ${node.textAlignHorizontal.toLowerCase()};\n`;
  if (Array.isArray(node.fills) && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      css += `color: rgba(${Math.round(fill.color.r * 255)}, ${Math.round(fill.color.g * 255)}, ${Math.round(fill.color.b * 255)}, ${fill.opacity || 1});\n`;
    }
  }

  return css;
}
import { FigmaNode } from './types';
import { rgbaToString } from './utils';
import { CSSGeneratorConfig } from './config';

function pxToRem(px: number, config: CSSGeneratorConfig): string {
  return `${px / config.remBase}rem`;
}

function formatSize(size: number, config: CSSGeneratorConfig): string {
  return config.units === 'px' ? `${size}px` : pxToRem(size, config);
}

export function generateCSS(node: SceneNode, config: CSSGeneratorConfig): string {
  let css = '';

  if (config.includePosition && 'x' in node && 'y' in node) {
    css += `position: absolute;\n`;
    css += `left: ${formatSize(node.x, config)};\n`;
    css += `top: ${formatSize(node.y, config)};\n`;
  }
  if (config.includeSize && 'width' in node && 'height' in node) {
    css += `width: ${formatSize(node.width, config)};\n`;
    css += `height: ${formatSize(node.height, config)};\n`;
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
        css += generateShapeCSS(node as unknown as Extract<FigmaNode, {fills?: readonly Paint[], strokes?: readonly Paint[]}>, config);
        break;
    case 'TEXT':
        css += generateTextCSS(node as Extract<FigmaNode, TextNode>, config);
        break;
  }

  return css;
}

function generateShapeCSS(node: Extract<FigmaNode, {fills?: readonly Paint[], strokes?: readonly Paint[]}>, config: CSSGeneratorConfig): string {
  let css = '';

  if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      css += `background-color: ${rgbaToString(fill.color, fill.opacity || 1)};\n`;
    }
  }
  if ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    if (stroke.type === 'SOLID' && 'strokeWeight' in node && typeof node.strokeWeight === 'number') {
      css += `border: ${formatSize(node.strokeWeight, config)} solid ${rgbaToString(stroke.color, stroke.opacity || 1)};\n`;
    }
  }
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
    css += `border-radius: ${formatSize(node.cornerRadius, config)};\n`;
  }

  return css;
}

function generateTextCSS(node: Extract<FigmaNode, TextNode>, config: CSSGeneratorConfig): string {
  let css = '';

  if (config.includeFontStyles) {
    if (node.fontName !== figma.mixed) {
      css += `font-family: ${String(node.fontName.family)};\n`;
      css += `font-weight: ${String(node.fontName.style)};\n`;
    }
    if (typeof node.fontSize === 'number') {
      css += `font-size: ${formatSize(node.fontSize, config)};\n`;
    }
    css += `text-align: ${node.textAlignHorizontal.toLowerCase()};\n`;
  }
  
  if (Array.isArray(node.fills) && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      css += `color: ${rgbaToString(fill.color, fill.opacity || 1)};\n`;
    }
  }

  return css;
}
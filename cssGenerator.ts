import { FigmaNode } from './types';
import { rgbaToString, generateSlug } from './utils';
import { CSSGeneratorConfig } from './config';

function pxToRem(px: number, config: CSSGeneratorConfig): string {
  return `${px / config.remBase}rem`;
}

function formatSize(size: number, config: CSSGeneratorConfig): string {
  return config.units === 'px' ? `${size}px` : pxToRem(size, config);
}

export function generateCSS(node: SceneNode, config: CSSGeneratorConfig, parentSlug: string = ''): { css: string, nestedCSS: Record<string, string> } {
  let css = '';
  const nestedCSS: Record<string, string> = {};
  const slug = parentSlug ? `${parentSlug}-${generateSlug(node.name)}` : generateSlug(node.name);

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
      css += generateShapeCSS(node, config);
      break;
    case 'GROUP':
      // Groups don't have their own styles
      break;
    case 'TEXT':
      css += generateTextCSS(node, config);
      break;
  }

  if ('children' in node && Array.isArray(node.children)) {
    node.children.forEach(child => {
      const childResult = generateCSS(child, config, slug);
      nestedCSS[`${generateSlug(child.name)}`] = childResult.css;
      Object.entries(childResult.nestedCSS).forEach(([key, value]) => {
        nestedCSS[`${generateSlug(child.name)}-${key}`] = value;
      });
    });
  }

  return { css, nestedCSS };
}

function generateShapeCSS(node: Extract<FigmaNode, RectangleNode | EllipseNode | PolygonNode | StarNode | VectorNode | LineNode | FrameNode | ComponentNode | InstanceNode>, config: CSSGeneratorConfig): string {
  let css = '';

  if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      css += `background-color: ${rgbaToString(fill.color, fill.opacity ?? 1)};\n`;
    } else if (fill.type === 'GRADIENT_LINEAR') {
      const gradientStops = fill.gradientStops.map((stop: { color: RGBA; position: number; }) => `${rgbaToString(stop.color, stop.color.a)} ${Math.round(stop.position * 100)}%`).join(', ');
      css += `background: linear-gradient(${fill.gradientTransform[0][2] * 180 / Math.PI}deg, ${gradientStops});\n`;
    }
  }

  if ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    if (stroke.type === 'SOLID' && 'strokeWeight' in node && typeof node.strokeWeight === 'number') {
      css += `border: ${formatSize(node.strokeWeight, config)} solid ${rgbaToString(stroke.color, stroke.opacity ?? 1)};\n`;
    }
  }

  if ('cornerRadius' in node && node.cornerRadius !== undefined) {
    if (typeof node.cornerRadius === 'number') {
      css += `border-radius: ${formatSize(node.cornerRadius, config)};\n`;
    } else if (typeof node.cornerRadius === 'object' && node.cornerRadius !== null) {
      const { topLeft, topRight, bottomRight, bottomLeft } = node.cornerRadius as { topLeft: number, topRight: number, bottomRight: number, bottomLeft: number };
      if (topLeft === topRight && topLeft === bottomLeft && topLeft === bottomRight) {
        css += `border-radius: ${formatSize(topLeft, config)};\n`;
      } else {
        css += `border-radius: ${formatSize(topLeft, config)} ${formatSize(topRight, config)} ${formatSize(bottomRight, config)} ${formatSize(bottomLeft, config)};\n`;
      }
    }
  }

  if ('effects' in node && Array.isArray(node.effects)) {
    node.effects.forEach(effect => {
      if (effect.type === 'DROP_SHADOW' && effect.visible) {
        css += `box-shadow: ${formatSize(effect.offset.x, config)} ${formatSize(effect.offset.y, config)} ${formatSize(effect.radius, config)} ${rgbaToString(effect.color, effect.color.a)};\n`;
      }
    });
  }

  return css;
}

function generateTextCSS(node: TextNode, config: CSSGeneratorConfig): string {
  let css = '';

  if (config.includeFontStyles) {
    if (node.fontName !== figma.mixed) {
      css += `font-family: ${node.fontName.family}, sans-serif;\n`;
      css += `font-weight: ${node.fontName.style.toLowerCase().includes('bold') ? 'bold' : 'normal'};\n`;
      css += `font-style: ${node.fontName.style.toLowerCase().includes('italic') ? 'italic' : 'normal'};\n`;
    }
    if (typeof node.fontSize === 'number') {
      css += `font-size: ${formatSize(node.fontSize, config)};\n`;
    }
    css += `text-align: ${node.textAlignHorizontal.toLowerCase()};\n`;
    if (typeof node.letterSpacing === 'number') {
      css += `letter-spacing: ${formatSize(node.letterSpacing, config)};\n`;
    }
    if (node.lineHeight && typeof node.lineHeight !== 'symbol') {
      if (node.lineHeight.unit === 'PIXELS') {
        css += `line-height: ${formatSize(node.lineHeight.value, config)};\n`;
      } else if (node.lineHeight.unit === 'PERCENT') {
        css += `line-height: ${node.lineHeight.value / 100};\n`;
      }
    }
  }
  
  if (Array.isArray(node.fills) && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      css += `color: ${rgbaToString(fill.color, fill.opacity ?? 1)};\n`;
    }
  }

  return css;
}
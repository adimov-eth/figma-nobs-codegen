import { FigmaNode, CustomCodegenResult } from './types';

export function rgbaToString(color: RGBA, opacity: number = 1): string {
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity})`;
  }


export function isTextNode(node: FigmaNode): node is TextNode {
    return node.type === 'TEXT';
  }
  
export function isValidCodegenResult(result: CustomCodegenResult): result is CodegenResult {
    const validLanguages = ['CSS', 'HTML', 'JSON', 'TYPESCRIPT', 'CPP', 'RUBY', 'JAVASCRIPT', 'GRAPHQL', 'PYTHON', 'GO', 'SQL', 'SWIFT', 'KOTLIN', 'RUST', 'BASH', 'PLAINTEXT'];
    return validLanguages.includes(result.language);
  }

export function generateSlug(name: string): string {
return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
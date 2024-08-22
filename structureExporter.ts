import { generateSlug } from './utils';

interface ExportedNode {
  id: string;
  name: string;
  type: string;
  slug: string;
  children?: ExportedNode[];
}

function traverseNode(node: SceneNode, parentSlug: string = ''): ExportedNode {
  const slug = parentSlug ? `${parentSlug}-${generateSlug(node.name)}` : generateSlug(node.name);
  const exportedNode: ExportedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    slug: slug,
  };

  if ('children' in node && Array.isArray(node.children)) {
    exportedNode.children = node.children.map(child => traverseNode(child as SceneNode, slug));
  }

  return exportedNode;
}

export function exportToHTML(node: SceneNode, pageSlug: string): string {
  function nodeToHTML(node: ExportedNode, depth: number = 0): string {
    const indent = '  '.repeat(depth);
    let html = `${indent}<div class="figma-node figma-${node.type.toLowerCase()} ${node.slug}" data-id="${node.id}">\n`;
    html += `${indent}  <span class="node-name">${node.name}</span>\n`;
    if (node.children) {
      node.children.forEach(child => {
        html += nodeToHTML(child, depth + 1);
      });
    }
    html += `${indent}</div>\n`;
    return html;
  }

  const exportedNode = traverseNode(node, pageSlug);
  return nodeToHTML(exportedNode);
}

export function exportToXML(node: SceneNode, pageSlug: string): string {
  function nodeToXML(node: ExportedNode, depth: number = 0): string {
    const indent = '  '.repeat(depth);
    let xml = `${indent}<node id="${node.id}" name="${node.name}" type="${node.type}" slug="${node.slug}">\n`;
    if (node.children) {
      node.children.forEach(child => {
        xml += nodeToXML(child, depth + 1);
      });
    }
    xml += `${indent}</node>\n`;
    return xml;
  }

  const exportedNode = traverseNode(node, pageSlug);
  return nodeToXML(exportedNode);
}

export function exportToJSON(node: SceneNode, pageSlug: string): ExportedNode {
  return traverseNode(node, pageSlug);
}
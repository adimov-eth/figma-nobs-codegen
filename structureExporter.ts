import { generateSlug } from './utils';
import { ExtractedData, ExportedNode } from './types';

export function exportToHTML(data: ExtractedData, parentSlug: string = ''): string {
  const slug = parentSlug ? `${parentSlug}-${generateSlug(data.name)}` : generateSlug(data.name);
  let html = `<div class="figma-node figma-${data.type.toLowerCase()} ${slug}" data-id="${data.id}">\n`;
  html += `  <span class="node-name">${data.name}</span>\n`;
  if (data.children) {
    data.children.forEach(child => {
      html += exportToHTML(child, slug);
    });
  }
  html += `</div>\n`;
  return html;
}

export function exportToXML(data: ExtractedData, parentSlug: string = ''): string {
  const slug = parentSlug ? `${parentSlug}-${generateSlug(data.name)}` : generateSlug(data.name);
  let xml = `<node id="${data.id}" name="${data.name}" type="${data.type}" slug="${slug}">\n`;
  if (data.children) {
    data.children.forEach(child => {
      xml += exportToXML(child, slug);
    });
  }
  xml += `</node>\n`;
  return xml;
}

export function exportToJSON(data: ExtractedData, parentSlug: string = ''): ExportedNode {
  const slug = parentSlug ? `${parentSlug}-${generateSlug(data.name)}` : generateSlug(data.name);
  const result: ExportedNode = {
    id: data.id,
    name: data.name,
    type: data.type,
    slug: slug
  };
  if (data.children) {
    result.children = data.children.map(child => exportToJSON(child, slug));
  }
  return result;
}
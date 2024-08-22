import { FigmaNode } from './types';

import { isTextNode } from './utils';

export function extractProperties(node: FigmaNode): Record<string, unknown> {
  const properties: Record<string, unknown> = {};

  // Common properties for all node types
  if ('visible' in node) properties.visible = node.visible;
  if ('locked' in node) properties.locked = node.locked;

  // Extract all properties based on node type
  switch (node.type) {
    case 'PAGE':
    case 'FRAME':
    case 'GROUP':
    case 'COMPONENT':
    case 'COMPONENT_SET':
    case 'INSTANCE':
      extractContainerProperties(node, properties);
      break;
    case 'RECTANGLE':
    case 'ELLIPSE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR':
    case 'LINE':
      extractShapeProperties(node as Extract<FigmaNode, {fills?: readonly Paint[]}>, properties);
      break;
    case 'BOOLEAN_OPERATION':
      extractShapeProperties(node as Extract<FigmaNode, {fills?: readonly Paint[]}>, properties);
      break;
    case 'TEXT':
        if (isTextNode(node)) {
            extractTextProperties(node, properties);
        }
      break;
    case 'SLICE':
      extractSliceProperties(node, properties);
      break;
    case 'STICKY':
    case 'SHAPE_WITH_TEXT':
    case 'CONNECTOR':
    case 'CODE_BLOCK':
    case 'STAMP':
    case 'WIDGET':
    case 'EMBED':
    case 'LINK_UNFURL':
    case 'MEDIA':
    case 'SECTION':
    case 'HIGHLIGHT':
    case 'WASHI_TAPE':
    case 'TABLE':
      extractSpecialProperties(node, properties);
      break;
  }

  return properties;
}

function extractContainerProperties(node: Extract<FigmaNode, {children: readonly SceneNode[]}>, properties: Record<string, unknown>) {
  if ('layoutMode' in node) properties.layoutMode = node.layoutMode;
  if ('primaryAxisSizingMode' in node) properties.primaryAxisSizingMode = node.primaryAxisSizingMode;
  if ('counterAxisSizingMode' in node) properties.counterAxisSizingMode = node.counterAxisSizingMode;
  if ('primaryAxisAlignItems' in node) properties.primaryAxisAlignItems = node.primaryAxisAlignItems;
  if ('counterAxisAlignItems' in node) properties.counterAxisAlignItems = node.counterAxisAlignItems;
  if ('paddingLeft' in node) properties.paddingLeft = node.paddingLeft;
  if ('paddingRight' in node) properties.paddingRight = node.paddingRight;
  if ('paddingTop' in node) properties.paddingTop = node.paddingTop;
  if ('paddingBottom' in node) properties.paddingBottom = node.paddingBottom;
  if ('itemSpacing' in node) properties.itemSpacing = node.itemSpacing;
  if ('layoutGrids' in node) properties.layoutGrids = node.layoutGrids;
  if ('gridStyleId' in node) properties.gridStyleId = node.gridStyleId;
  if ('clipsContent' in node) properties.clipsContent = node.clipsContent;
  if ('guides' in node) properties.guides = node.guides;
}

function extractShapeProperties(
    node: Extract<
      FigmaNode,
      RectangleNode
      | EllipseNode
      | PolygonNode
      | StarNode
      | VectorNode
      | LineNode
      | BooleanOperationNode
      | FrameNode
      | ComponentNode
      | InstanceNode
    >,
    properties: Record<string, unknown>
  ) {
  if ('fills' in node) properties.fills = node.fills;
  if ('strokes' in node) properties.strokes = node.strokes;
  if ('strokeWeight' in node) properties.strokeWeight = node.strokeWeight;
  if ('strokeAlign' in node) properties.strokeAlign = node.strokeAlign;
  if ('strokeCap' in node) properties.strokeCap = node.strokeCap;
  if ('strokeJoin' in node) properties.strokeJoin = node.strokeJoin;
  if ('dashPattern' in node) properties.dashPattern = node.dashPattern;
  if ('fillStyleId' in node) properties.fillStyleId = node.fillStyleId;
  if ('strokeStyleId' in node) properties.strokeStyleId = node.strokeStyleId;
  if ('cornerRadius' in node) properties.cornerRadius = node.cornerRadius;
  if ('cornerSmoothing' in node) properties.cornerSmoothing = node.cornerSmoothing;
  if ('topLeftRadius' in node) properties.topLeftRadius = node.topLeftRadius;
  if ('topRightRadius' in node) properties.topRightRadius = node.topRightRadius;
  if ('bottomLeftRadius' in node) properties.bottomLeftRadius = node.bottomLeftRadius;
  if ('bottomRightRadius' in node) properties.bottomRightRadius = node.bottomRightRadius;
}

function extractTextProperties(node: Extract<FigmaNode, TextNode>, properties: Record<string, unknown>) {
  properties.characters = node.characters;
  properties.fontSize = node.fontSize;
  properties.fontName = node.fontName;
  properties.textAlignHorizontal = node.textAlignHorizontal;
  properties.textAlignVertical = node.textAlignVertical;
  properties.textAutoResize = node.textAutoResize;
  properties.paragraphIndent = node.paragraphIndent;
  properties.paragraphSpacing = node.paragraphSpacing;
  properties.textCase = node.textCase;
  properties.textDecoration = node.textDecoration;
  properties.letterSpacing = node.letterSpacing;
  properties.lineHeight = node.lineHeight;
  properties.textStyleId = node.textStyleId;
}

function extractSliceProperties(node: Extract<FigmaNode, SliceNode>, properties: Record<string, unknown>) {
  properties.exportSettings = node.exportSettings;
}

function extractSpecialProperties(node: FigmaNode, properties: Record<string, unknown>) {
  if ('text' in node) properties.text = node.text;
  if ('code' in node) properties.code = node.code;
  if ('codeLanguage' in node) properties.codeLanguage = node.codeLanguage;
  if ('widgetId' in node) properties.widgetId = node.widgetId;
  if ('widgetSyncedState' in node) properties.widgetSyncedState = node.widgetSyncedState;
  if ('embedData' in node) properties.embedData = node.embedData;
  if ('linkUnfurlData' in node) properties.linkUnfurlData = node.linkUnfurlData;
  if ('mediaData' in node) properties.mediaData = node.mediaData;
}
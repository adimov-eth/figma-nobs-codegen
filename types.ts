export type FigmaNode =
  | SceneNode
  | PageNode
  | RectangleNode
  | EllipseNode
  | PolygonNode
  | StarNode
  | VectorNode
  | LineNode
  | BooleanOperationNode
  | FrameNode
  | ComponentNode
  | InstanceNode;

export type ExtractedData = {
  id: string;
  name: string;
  type: NodeType;
  properties: Record<string, unknown>;
  css: string;
  children?: ExtractedData[];
};
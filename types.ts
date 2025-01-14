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

export interface ExportedNode {
  id: string;
  name: string;
  type: string;
  slug: string;
  children?: ExportedNode[];
}

export type ExtractedData = {
  id: string;
  name: string;
  type: NodeType;
  properties: Record<string, unknown>;
  css: {
    main: string;
    nested: Record<string, string>;
  };
  children?: ExtractedData[];
};

export interface CustomCodegenResult extends Omit<CodegenResult, 'language'> {
    language: CodegenResultLanguage;
  }
  
  export type CodegenResultLanguage = "CSS" | "HTML" | "JSON" | "XML" | "TYPESCRIPT" | "CPP" | "RUBY" | "JAVASCRIPT" | "GRAPHQL" | "PYTHON" | "GO" | "SQL" | "SWIFT" | "KOTLIN" | "RUST" | "BASH" | "PLAINTEXT";
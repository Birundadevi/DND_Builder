export type BlockType = 'text' | 'image' | 'button' | 'container';

export interface BlockStyles {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: string;
  width?: string;
  height?: string;
}

export interface BlockContent {
  text?: string;
  src?: string;
  alt?: string;
  url?: string;
}

export interface BlockItem {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  content: BlockContent;
  styles: BlockStyles;
}

export interface LayoutSchema {
  version: number;
  blocks: BlockItem[];
}
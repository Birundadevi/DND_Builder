import React, { createContext, useState, useCallback, useMemo } from 'react';
import { BlockItem, BlockType } from '../types/block';
import { generateId } from '../utils/helpers';
import { sanitizeText, sanitizeUrl, sanitizeCssValue } from '../utils/sanitize';
import { validateImportedLayout } from '../utils/validate';

interface BuilderContextType {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  selectedBlock: BlockItem | null;
  addBlock: (type: BlockType, x?: number, y?: number) => void;
  updateBlockPosition: (id: string, x: number, y: number) => void;
  updateBlockContent: (id: string, key: string, value: string) => void;
  updateBlockStyles: (id: string, key: string, value: string) => void;
  deleteBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  clearCanvas: () => void;
  exportJson: () => string;
  importJson: (jsonString: string) => boolean;
}

export const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

const INITIAL_BLOCKS: BlockItem[] = [
  {
    id: 'b1',
    type: 'text',
    x: 40,
    y: 40,
    content: { text: 'Welcome to your Drag & Drop Workspace!' },
    styles: { fontSize: '18px', color: '#1e293b', textAlign: 'left' }
  },
  {
    id: 'b2',
    type: 'button',
    x: 40,
    y: 110,
    content: { text: 'Click Me', url: 'https://example.com' },
    styles: { backgroundColor: '#4f46e5', color: '#ffffff', padding: '10px 20px', borderRadius: '6px' }
  }
];

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blocks, setBlocks] = useState<BlockItem[]>(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  const addBlock = useCallback((type: BlockType, x = 60, y = 60) => {
    const newBlock: BlockItem = {
      id: generateId(),
      type,
      x,
      y,
      content: {
        text: type === 'text' ? 'New text block' : type === 'button' ? 'Click action' : '',
        src: type === 'image' ? 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=200&fit=crop' : '',
        alt: type === 'image' ? 'Placeholder image' : '',
        url: ''
      },
      styles: {
        backgroundColor: type === 'container' ? '#f1f5f9' : 'transparent',
        color: '#0f172a',
        padding: '12px',
        fontSize: '14px',
        textAlign: 'left',
        borderRadius: '8px',
        width: type === 'container' ? '280px' : 'auto',
        height: type === 'container' ? '180px' : 'auto'
      }
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  }, []);

  // Highly optimized standalone position updater to decouple drag ticks from heavy UI trees
  const updateBlockPosition = useCallback((id: string, x: number, y: number) => {
    setBlocks(prev =>
      prev.map(block => (block.id === id ? { ...block, x: Math.max(0, x), y: Math.max(0, y) } : block))
    );
  }, []);

  const updateBlockContent = useCallback((id: string, key: string, value: string) => {
    const cleanValue = key === 'url' || key === 'src' ? sanitizeUrl(value) : sanitizeText(value);
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, content: { ...block.content, [key]: cleanValue } } : block
      )
    );
  }, []);

  const updateBlockStyles = useCallback((id: string, key: string, value: string) => {
    const cleanValue = sanitizeCssValue(value);
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, styles: { ...block.styles, [key]: cleanValue } } : block
      )
    );
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    setSelectedBlockId(current => (current === id ? null : current));
  }, []);

  const clearCanvas = useCallback(() => {
    setBlocks([]);
    setSelectedBlockId(null);
  }, []);

  const exportJson = useCallback(() => {
    const layout = {
      version: 1,
      blocks
    };
    return JSON.stringify(layout, null, 2);
  }, [blocks]);

  const importJson = useCallback((jsonString: string): boolean => {
    const layout = validateImportedLayout(jsonString);
    if (!layout) return false;
    setBlocks(layout.blocks);
    setSelectedBlockId(null);
    return true;
  }, []);

  const selectedBlock = useMemo(() => {
    return blocks.find(b => b.id === selectedBlockId) || null;
  }, [blocks, selectedBlockId]);

  const value = useMemo(
    () => ({
      blocks,
      selectedBlockId,
      selectedBlock,
      addBlock,
      updateBlockPosition,
      updateBlockContent,
      updateBlockStyles,
      deleteBlock,
      selectBlock,
      clearCanvas,
      exportJson,
      importJson
    }),
    [
      blocks,
      selectedBlockId,
      selectedBlock,
      addBlock,
      updateBlockPosition,
      updateBlockContent,
      updateBlockStyles,
      deleteBlock,
      selectBlock,
      clearCanvas,
      exportJson,
      importJson
    ]
  );

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
};
import React, { createContext, useState, useCallback, useMemo } from 'react';
import { BlockItem, BlockType } from '../types/block';
import { generateId } from '../utils/helpers';
import { sanitizeText, sanitizeUrl, sanitizeCssValue } from '../utils/sanitize';
import { validateImportedLayout } from '../utils/validate';

interface BuilderContextType {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  selectedBlock: BlockItem | null;
  canUndo: boolean;
  canRedo: boolean;
  addBlock: (type: BlockType, x?: number, y?: number) => void;
  updateBlockPosition: (id: string, x: number, y: number) => void;
  updateBlockContent: (id: string, key: string, value: string) => void;
  updateBlockStyles: (id: string, key: string, value: string) => void;
  deleteBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
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
  // History Stacks for Undo / Redo
  const [past, setPast] = useState<BlockItem[][]>([INITIAL_BLOCKS]);
  const [present, setPresent] = useState<BlockItem[]>(INITIAL_BLOCKS);
  const [future, setFuture] = useState<BlockItem[][]>([]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  // Helper to commit state changes into history stack
  const recordHistory = useCallback((newBlocks: BlockItem[]) => {
    setPresent(currentPresent => {
      if (JSON.stringify(currentPresent) === JSON.stringify(newBlocks)) return currentPresent;
      setPast(prevPast => [...prevPast, currentPresent]);
      setFuture([]); // Clear redo future stack on new user action
      return newBlocks;
    });
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture(currFuture => [present, ...currFuture]);
    setPresent(previous);
    setSelectedBlockId(null);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast(prevPast => [...prevPast, present]);
    setPresent(next);
    setFuture(newFuture);
    setSelectedBlockId(null);
  }, [future, present]);

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
    
    setPresent(current => {
      const next = [...current, newBlock];
      recordHistory(next);
      return next;
    });
    setSelectedBlockId(newBlock.id);
  }, [recordHistory]);

  const updateBlockPosition = useCallback((id: string, x: number, y: number) => {
    setPresent(current =>
      current.map(block => (block.id === id ? { ...block, x: Math.max(0, x), y: Math.max(0, y) } : block))
    );
  }, []);

  const updateBlockContent = useCallback((id: string, key: string, value: string) => {
    const cleanValue = key === 'url' || key === 'src' ? sanitizeUrl(value) : sanitizeText(value);
    setPresent(current => {
      const next = current.map(block =>
        block.id === id ? { ...block, content: { ...block.content, [key]: cleanValue } } : block
      );
      recordHistory(next);
      return next;
    });
  }, [recordHistory]);

  const updateBlockStyles = useCallback((id: string, key: string, value: string) => {
    const cleanValue = sanitizeCssValue(value);
    setPresent(current => {
      const next = current.map(block =>
        block.id === id ? { ...block, styles: { ...block.styles, [key]: cleanValue } } : block
      );
      recordHistory(next);
      return next;
    });
  }, [recordHistory]);

  const deleteBlock = useCallback((id: string) => {
    setPresent(current => {
      const next = current.filter(block => block.id !== id);
      recordHistory(next);
      return next;
    });
    setSelectedBlockId(current => (current === id ? null : current));
  }, [recordHistory]);

  const clearCanvas = useCallback(() => {
    setPresent(current => {
      if (current.length === 0) return current;
      recordHistory([]);
      return [];
    });
    setSelectedBlockId(null);
  }, [recordHistory]);

  const exportJson = useCallback(() => {
    const layout = {
      version: 1,
      blocks: present
    };
    return JSON.stringify(layout, null, 2);
  }, [present]);

  const importJson = useCallback((jsonString: string): boolean => {
    const layout = validateImportedLayout(jsonString);
    if (!layout) return false;
    
    setPresent(layout.blocks);
    recordHistory(layout.blocks);
    setSelectedBlockId(null);
    return true;
  }, [recordHistory]);

  const selectedBlock = useMemo(() => {
    return present.find(b => b.id === selectedBlockId) || null;
  }, [present, selectedBlockId]);

  const value = useMemo(
    () => ({
      blocks: present,
      selectedBlockId,
      selectedBlock,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
      addBlock,
      updateBlockPosition,
      updateBlockContent,
      updateBlockStyles,
      deleteBlock,
      selectBlock,
      clearCanvas,
      undo,
      redo,
      exportJson,
      importJson
    }),
    [
      present,
      selectedBlockId,
      selectedBlock,
      past.length,
      future.length,
      addBlock,
      updateBlockPosition,
      updateBlockContent,
      updateBlockStyles,
      deleteBlock,
      selectBlock,
      clearCanvas,
      undo,
      redo,
      exportJson,
      importJson
    ]
  );

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
};
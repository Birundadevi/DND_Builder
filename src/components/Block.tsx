import React, { memo, useRef, useCallback } from 'react';
import { BlockItem } from '../types/block';
import { useBuilder } from '../hooks/useBuilder';
import { Trash2 } from 'lucide-react';
import { sanitizeText, sanitizeUrl } from '../utils/sanitize';
import { calculateSnapPosition } from '../utils/snap';

interface BlockProps {
  block: BlockItem;
  isSelected: boolean;
}

export const Block: React.FC<BlockProps> = memo(({ block, isSelected }) => {
  const { blocks, selectBlock, updateBlockPosition, deleteBlock } = useBuilder();
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(block.id);
  }, [block.id, selectBlock]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    selectBlock(block.id);
    isDraggingRef.current = true;
    
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    dragOffsetRef.current = {
      x: e.clientX - block.x,
      y: e.clientY - block.y
    };
  }, [block.id, block.x, block.y, selectBlock]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const rawX = e.clientX - dragOffsetRef.current.x;
    const rawY = e.clientY - dragOffsetRef.current.y;

    const { x, y } = calculateSnapPosition(rawX, rawY, blocks, block.id);
    updateBlockPosition(block.id, x, y);
  }, [block.id, blocks, updateBlockPosition]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const target = e.currentTarget as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleDeleteClick = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteBlock(block.id);
  }, [block.id, deleteBlock]);

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <p style={{ fontSize: block.styles.fontSize, color: block.styles.color, textAlign: block.styles.textAlign }}>
            {sanitizeText(block.content.text) || 'Empty text block'}
          </p>
        );
      case 'image':
        return (
          <div className="overflow-hidden rounded-md pointer-events-none">
            <img
              src={sanitizeUrl(block.content.src) || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=200&fit=crop'}
              alt={sanitizeText(block.content.alt) || 'Block image'}
              className="w-full h-32 object-cover"
            />
          </div>
        );
      case 'button':
        return (
          <button
            style={{
              backgroundColor: block.styles.backgroundColor || '#4f46e5',
              color: block.styles.color || '#ffffff',
              padding: block.styles.padding || '8px 16px',
              borderRadius: block.styles.borderRadius || '6px',
              fontSize: block.styles.fontSize || '14px',
            }}
            className="font-medium shadow-2xs pointer-events-none"
          >
            {sanitizeText(block.content.text) || 'Button'}
          </button>
        );
      case 'container':
        return (
          <div
            style={{
              backgroundColor: block.styles.backgroundColor || '#f1f5f9',
              borderRadius: block.styles.borderRadius || '8px',
              width: block.styles.width || '260px',
              height: block.styles.height || '160px',
              padding: block.styles.padding || '12px'
            }}
            className="border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400"
          >
            Container Frame
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate3d(${block.x}px, ${block.y}px, 0)`,
        padding: block.type !== 'container' ? block.styles.padding : undefined,
      }}
      className={`absolute top-0 left-0 cursor-grab active:cursor-grabbing group select-none transition-shadow duration-150 ${
        isSelected
          ? 'ring-2 ring-indigo-600 ring-offset-2 shadow-md z-30 bg-white rounded-lg'
          : 'hover:ring-1 hover:ring-slate-300 z-10 bg-white/90 backdrop-blur-xs rounded-lg shadow-2xs'
      }`}
    >
      {/* Delete button with aggressive pointer & click isolation */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={handleDeleteClick}
        className="absolute -top-3 -right-3 bg-rose-600 text-white p-1.5 rounded-full shadow-md hover:bg-rose-700 active:scale-95 transition-all cursor-pointer z-40 flex items-center justify-center"
        title="Delete Block"
      >
        <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
      </button>

      {renderContent()}
    </div>
  );
});

Block.displayName = 'Block';
import React from 'react';
import { useBuilder } from '../hooks/useBuilder';
import { Block } from './Block';
import { BlockType } from '../types/block';
import { Layers } from 'lucide-react';

export const Canvas: React.FC = () => {
  const { blocks, selectedBlockId, selectBlock, addBlock } = useBuilder();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as BlockType;
    if (!type) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    // Calculate drop coordinates factoring in scroll position
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const x = e.clientX - rect.left + scrollLeft - 40; // Center offset adjustment
    const y = e.clientY - rect.top + scrollTop - 20;

    addBlock(type, Math.max(0, x), Math.max(0, y));
  };

  return (
    <main
      onClick={() => selectBlock(null)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-1 relative bg-slate-100/70 overflow-auto h-full select-none"
    >
      {/* Background dot grid pattern indicator */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      {blocks.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none z-0">
          <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200 mb-3">
            <Layers className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="font-semibold text-sm text-slate-600">Canvas is currently empty</p>
          <p className="text-xs text-slate-400 mt-1">Drag and drop items from the left palette to begin building.</p>
        </div>
      )}

      {/* Large scrollable absolute board wrapper */}
      <div className="relative w-[3000px] h-[3000px] pointer-events-auto">
        {blocks.map(block => (
          <Block
            key={block.id}
            block={block}
            isSelected={block.id === selectedBlockId}
          />
        ))}
      </div>
    </main>
  );
};
import React from 'react';
import { useBuilder } from '../hooks/useBuilder';
import { BlockType } from '../types/block';
import { Type, Image as ImageIcon, Square, LayoutGrid, GripVertical } from 'lucide-react';

interface PaletteItemConfig {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const PALETTE_ITEMS: PaletteItemConfig[] = [
  { type: 'text', label: 'Text Block', icon: <Type className="w-4 h-4 text-indigo-600" />, description: 'Heading or paragraph content' },
  { type: 'image', label: 'Image Element', icon: <ImageIcon className="w-4 h-4 text-emerald-600" />, description: 'Remote raster graphic asset' },
  { type: 'button', label: 'Action Button', icon: <Square className="w-4 h-4 text-amber-600" />, description: 'Clickable call-to-action button' },
  { type: 'container', label: 'Layout Box', icon: <LayoutGrid className="w-4 h-4 text-blue-600" />, description: 'Structural wrapper panel' },
];

export const Palette: React.FC = () => {
  const { addBlock } = useBuilder();

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-72 flex-shrink-0 border-r border-slate-200 bg-white p-5 flex flex-col h-full select-none">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Component Palette</h2>
      <p className="text-xs text-slate-500 mb-4">Drag components onto the canvas or click to add.</p>
      
      <div className="space-y-2.5 overflow-y-auto pr-1">
        {PALETTE_ITEMS.map(item => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            onClick={() => addBlock(item.type)}
            className="group flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing shadow-2xs hover:shadow-xs"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200/60 shadow-2xs group-hover:border-indigo-200 transition-colors">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-800">{item.label}</h3>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.description}</p>
              </div>
            </div>
            <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </div>
        ))}
      </div>
    </aside>
  );
};
import React from 'react';
import { useBuilder } from '../hooks/useBuilder';
import { Sliders, Trash2 } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { selectedBlock, updateBlockContent, updateBlockStyles, deleteBlock } = useBuilder();

  if (!selectedBlock) {
    return (
      <aside className="w-80 flex-shrink-0 border-l border-slate-200 bg-white p-5 flex flex-col h-full select-none">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Properties</h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 px-4">
          <Sliders className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
          <p className="text-xs font-medium text-slate-600">No block selected</p>
          <p className="text-[11px] text-slate-400 mt-1">Click on any element in the canvas to inspect and configure its attributes.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 flex-shrink-0 border-l border-slate-200 bg-white p-5 flex flex-col h-full overflow-y-auto select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Properties</h2>
          <span className="text-xs font-semibold text-indigo-600 capitalize">{selectedBlock.type} Block</span>
        </div>
        <button
          onClick={() => deleteBlock(selectedBlock.id)}
          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Block"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {(selectedBlock.type === 'text' || selectedBlock.type === 'button') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Text Content</label>
            <input
              type="text"
              value={selectedBlock.content.text || ''}
              onChange={e => updateBlockContent(selectedBlock.id, 'text', e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        )}

        {selectedBlock.type === 'image' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Image Source URL</label>
              <input
                type="text"
                value={selectedBlock.content.src || ''}
                onChange={e => updateBlockContent(selectedBlock.id, 'src', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Alt Description</label>
              <input
                type="text"
                value={selectedBlock.content.alt || ''}
                onChange={e => updateBlockContent(selectedBlock.id, 'alt', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </>
        )}

        {selectedBlock.type === 'button' && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Action URL</label>
            <input
              type="text"
              value={selectedBlock.content.url || ''}
              onChange={e => updateBlockContent(selectedBlock.id, 'url', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        )}

        <hr className="border-slate-100 my-2" />

        {(selectedBlock.type === 'text' || selectedBlock.type === 'button') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Font Size</label>
            <select
              value={selectedBlock.styles.fontSize || '14px'}
              onChange={e => updateBlockStyles(selectedBlock.id, 'fontSize', e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="12px">Small (12px)</option>
              <option value="14px">Normal (14px)</option>
              <option value="18px">Medium (18px)</option>
              <option value="24px">Large (24px)</option>
              <option value="32px">Heading (32px)</option>
            </select>
          </div>
        )}

        {(selectedBlock.type === 'button' || selectedBlock.type === 'container') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedBlock.styles.backgroundColor || '#ffffff'}
                onChange={e => updateBlockStyles(selectedBlock.id, 'backgroundColor', e.target.value)}
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={selectedBlock.styles.backgroundColor || '#ffffff'}
                onChange={e => updateBlockStyles(selectedBlock.id, 'backgroundColor', e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        )}

        {(selectedBlock.type === 'text' || selectedBlock.type === 'button') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedBlock.styles.color || '#000000'}
                onChange={e => updateBlockStyles(selectedBlock.id, 'color', e.target.value)}
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={selectedBlock.styles.color || '#000000'}
                onChange={e => updateBlockStyles(selectedBlock.id, 'color', e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        )}

        {selectedBlock.type === 'container' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Width</label>
              <input
                type="text"
                value={selectedBlock.styles.width || '280px'}
                onChange={e => updateBlockStyles(selectedBlock.id, 'width', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Height</label>
              <input
                type="text"
                value={selectedBlock.styles.height || '180px'}
                onChange={e => updateBlockStyles(selectedBlock.id, 'height', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
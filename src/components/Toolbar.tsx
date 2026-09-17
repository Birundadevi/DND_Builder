import React, { useRef, useState } from 'react';
import { useBuilder } from '../hooks/useBuilder';
import { Download, Upload, Trash2, FileCode2} from 'lucide-react';
import { Undo2, Redo2 } from 'lucide-react';

export const Toolbar: React.FC = () => {
  const { exportJson, importJson, clearCanvas, blocks } = useBuilder();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { undo, redo, canUndo, canRedo } = useBuilder();

  const handleExport = () => {
    const jsonStr = exportJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `layout-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccessMsg('Exported!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = importJson(content);
      if (success) {
        setSuccessMsg('Loaded!');
        setErrorMsg(null);
      } else {
        setErrorMsg('Invalid JSON schema.');
      }
      setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header style={{ height: '100%', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '8px', borderRadius: '8px', display: 'flex' }}>
          <FileCode2 className="w-5 h-5" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b', lineHeight: '1.2' }}>Visual Board Studio</h1>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>React + TS Performant Layout Builder</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {successMsg && <span style={{ fontSize: '11px', color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>{successMsg}</span>}
        {errorMsg && <span style={{ fontSize: '11px', color: '#e11d48', background: '#fff1f2', padding: '4px 10px', borderRadius: '999px', border: '1px solid #fecdd3' }}>{errorMsg}</span>}

        <button onClick={handleExport} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500, color: '#334155', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>
          <Download className="w-3.5 h-3.5" /> Export JSON
        </button>

        <button onClick={() => fileInputRef.current?.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500, color: '#334155', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>
          <Upload className="w-3.5 h-3.5" /> Import JSON
        </button>
        <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />

        <button onClick={() => { if (blocks.length === 0 || window.confirm('Clear canvas?')) clearCanvas(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500, color: '#be123c', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '6px', cursor: 'pointer' }}>
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
  <button 
    onClick={undo} 
    disabled={!canUndo}
    style={{ 
      opacity: canUndo ? 1 : 0.4, 
      cursor: canUndo ? 'pointer' : 'not-allowed',
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px', 
      padding: '6px 12px', 
      fontSize: '12px', 
      fontWeight: 500, 
      color: '#334155', 
      backgroundColor: '#f1f5f9', 
      border: '1px solid #cbd5e1', 
      borderRadius: '6px' 
    }}
  >
    <Undo2 className="w-3.5 h-3.5" /> Undo
  </button>

  <button 
    onClick={redo} 
    disabled={!canRedo}
    style={{ 
      opacity: canRedo ? 1 : 0.4, 
      cursor: canRedo ? 'pointer' : 'not-allowed',
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px', 
      padding: '6px 12px', 
      fontSize: '12px', 
      fontWeight: 500, 
      color: '#334155', 
      backgroundColor: '#f1f5f9', 
      border: '1px solid #cbd5e1', 
      borderRadius: '6px' 
    }}
  >
    <Redo2 className="w-3.5 h-3.5" /> Redo
  </button>
</div>
      </div>
    </header>
  );
};
import React from 'react';
import { BuilderProvider } from './state/BuilderContext';
import { Toolbar } from './components/Toolbar';
import { Palette } from './components/Palette';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';

export function App() {
  return (
    <BuilderProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* Top Toolbar Header */}
        <div style={{ height: '64px', flexShrink: 0, zIndex: 30 }}>
          <Toolbar />
        </div>

        {/* Main Builder Workspace (3 columns: Palette, Canvas, Properties) */}
        <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 64px)', overflow: 'hidden', position: 'relative' }}>
          <Palette />
          <Canvas />
          <PropertiesPanel />
        </div>
      </div>
    </BuilderProvider>
  );
}

export default App;
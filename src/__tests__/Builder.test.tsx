import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Visual Board Studio Builder', () => {
  it('renders the toolbar and palette components', () => {
    render(<App />);
    expect(screen.getByText('Visual Board Studio')).toBeDefined();
    expect(screen.getByText('Component Palette')).toBeDefined();
    expect(screen.getByText('Text Block')).toBeDefined();
  });

  it('spawns a text block onto the board when clicked', () => {
    render(<App />);
    const textPaletteItem = screen.getByText('Text Block');
    
    // Click to add block
    fireEvent.click(textPaletteItem);

    // Verify it appears in the properties panel or canvas
    expect(screen.getByText('Text Content')).toBeDefined();
  });
});
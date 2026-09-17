import { BlockItem } from '../types/block';

const GRID_SIZE = 20;
const SNAP_THRESHOLD = 6;

export function calculateSnapPosition(x: number, y: number, blocks: BlockItem[], currentId: string) {
  // Default grid snapping
  let snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
  let snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;

  // Alignment guide checking against other blocks on the canvas
  for (const block of blocks) {
    if (block.id === currentId) continue;

    // Snap to left edge of another block
    if (Math.abs(block.x - x) < SNAP_THRESHOLD) {
      snappedX = block.x;
    }
    // Snap to top edge of another block
    if (Math.abs(block.y - y) < SNAP_THRESHOLD) {
      snappedY = block.y;
    }
  }

  return { x: snappedX, y: snappedY };
}
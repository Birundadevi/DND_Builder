import { z } from 'zod';
import { LayoutSchema } from '../types/block';

const BlockContentSchema = z.object({
  text: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  url: z.string().optional(),
}).strict();

const BlockStylesSchema = z.object({
  backgroundColor: z.string().optional(),
  color: z.string().optional(),
  padding: z.string().optional(),
  fontSize: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  borderRadius: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
}).strict();

const BlockItemSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'button', 'container']),
  x: z.number(),
  y: z.number(),
  content: BlockContentSchema,
  styles: BlockStylesSchema,
}).strict();

const LayoutParserSchema = z.object({
  version: z.number(),
  blocks: z.array(BlockItemSchema),
}).strict();

/**
 * Safely parses and validates arbitrary JSON structures against the layout contract.
 */
export function validateImportedLayout(jsonString: string): LayoutSchema | null {
  try {
    const parsed = JSON.parse(jsonString);
    const result = LayoutParserSchema.safeParse(parsed);
    if (!result.success) {
      console.warn('Invalid layout structure schema:', result.error);
      return null;
    }
    return result.data as LayoutSchema;
  } catch (err) {
    console.warn('Failed to parse JSON string:', err);
    return null;
  }
}
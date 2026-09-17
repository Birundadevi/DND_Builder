/**
 * Safely sanitizes arbitrary user text strings to defend against XSS.
 * Strips HTML angle brackets.
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>]/g, '');
}

/**
 * Validates and sanitizes URLs (used for images, buttons, links) 
 * to prevent javascript: or data: injection exploits.
 */
export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return '';
  }
  return encodeURI(trimmed);
}

/**
 * Validates generic CSS values or colors against dangerous vectors.
 */
export function sanitizeCssValue(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Reject values containing expression() or urls pointing to scripts
  if (/expression|url\s*\(\s*['"]?\s*javascript:/i.test(input)) {
    return '';
  }
  return input.replace(/[<>]/g, '');
}
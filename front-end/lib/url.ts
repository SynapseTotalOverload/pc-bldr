// URL validation helpers

/**
 * Returns true if the given string is a valid HTTP(S) URL.
 */
export function isValidUrl(candidate: string): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();
  if (trimmed.length === 0) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns true if the value is empty OR a valid URL.
 * Useful for optional URL fields.
 */
export function isEmptyOrValidUrl(candidate: string | undefined | null): boolean {
  if (!candidate || candidate.toString().trim() === '') return true;
  return isValidUrl(candidate.toString());
}



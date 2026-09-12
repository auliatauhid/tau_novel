/**
 * Utility functions for handling and normalizing novel cover image URLs.
 */

/**
 * Normalizes an image URL from various sources (Google Drive, Dropbox, Imgur, direct URLs, etc.)
 * into a direct, embeddable image link.
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';

  // Clean leading and trailing whitespace, quotation marks, and angle brackets
  let cleaned = url.trim().replace(/^["'\s<]+|["'\s>]+$/g, '');
  if (!cleaned) return '';

  // Handle Markdown link format: [text](https://...)
  const mdMatch = cleaned.match(/\[.*?\]\((https?:\/\/[^\s\)]+)\)/);
  if (mdMatch) cleaned = mdMatch[1];

  // 1. Google Drive Links:
  // - https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
  // - https://drive.google.com/file/d/{FILE_ID}/view
  // - https://drive.google.com/open?id={FILE_ID}
  // - https://drive.google.com/uc?id={FILE_ID}
  const gDriveMatch = cleaned.match(
    /drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+)|uc\?(?:export=view&)?id=([a-zA-Z0-9_-]+))/
  );
  if (gDriveMatch) {
    const fileId = gDriveMatch[1] || gDriveMatch[2] || gDriveMatch[3];
    // lh3.googleusercontent.com/d/{fileId} is Google's official direct high-res image CDN
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // 2. Dropbox Links:
  // Convert webpage view to raw direct image view
  if (cleaned.includes('dropbox.com/')) {
    const urlWithoutQuery = cleaned.split('?')[0];
    return `${urlWithoutQuery}?raw=1`;
  }

  // 3. Imgur non-direct page links:
  // https://imgur.com/abc1234 -> https://i.imgur.com/abc1234.jpg
  const imgurMatch = cleaned.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurMatch) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
  }

  // 4. Ensure protocol if URL starts with a domain name
  if (
    !cleaned.startsWith('http://') &&
    !cleaned.startsWith('https://') &&
    !cleaned.startsWith('/') &&
    !cleaned.startsWith('data:')
  ) {
    cleaned = 'https://' + cleaned;
  }

  return cleaned;
}

/**
 * Checks if a string looks like a valid image URL or path.
 */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

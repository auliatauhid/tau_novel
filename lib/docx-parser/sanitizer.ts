import sanitizeHtml from 'sanitize-html';

export function sanitizeContent(dirtyHtml: string): string {
  if (!dirtyHtml) return '';

  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      'p',
      'b',
      'i',
      'strong',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'hr',
      'br',
      'span',
      'u',
      's',
      'strike',
      'ol',
      'ul',
      'li',
    ],
    allowedAttributes: {
      '*': ['class'],
    },
    disallowedTagsMode: 'discard',
    exclusiveFilter: (frame) => {
      // Drop script, style, iframe, object, embed if any
      return false;
    },
  });
}

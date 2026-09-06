import { sanitizeContent } from './sanitizer';

export function normalizeContent(content: string): string {
  if (!content) return '';

  let html = content;

  // 1. Remove Word comments and conditional comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Remove XML tags like <o:p>...</o:p> or <w:...>
  html = html.replace(/<\/?\w+:[^>]*>/g, '');

  // 3. Remove inline styles and mso attributes
  html = html.replace(/\s*style="[^"]*"/gi, '');
  html = html.replace(/\s*class="[^"]*"/gi, '');
  html = html.replace(/\s*lang="[^"]*"/gi, '');

  // 4. Sanitize first with allowed tags
  html = sanitizeContent(html);

  // 5. Remove empty paragraphs or paragraphs with only &nbsp; or whitespace
  html = html.replace(/<p\b[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '');

  // 6. Reduce multiple consecutive <br /> tags
  html = html.replace(/(<br\s*\/?>\s*){3,}/gi, '<br /><br />');

  // 7. Ensure clean paragraph structure
  // Trim leading and trailing whitespace/linebreaks
  html = html.trim();

  // If text is not wrapped in paragraphs and has newlines, wrap in <p>
  if (!html.startsWith('<p') && !html.startsWith('<h') && !html.startsWith('<blockquote')) {
    const paragraphs = html
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (paragraphs.length > 0) {
      html = paragraphs.map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('\n');
    }
  }

  return html;
}

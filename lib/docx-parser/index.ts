import mammoth from 'mammoth';
import { ParsedResult } from './types';
import { extractMetadata } from './metadata-parser';
import { detectChapters } from './chapter-detector';

export * from './types';
export * from './sanitizer';
export * from './content-normalizer';
export * from './metadata-parser';
export * from './chapter-detector';
export * from './utils';

export function parseTextOrHtml(rawText: string, defaultTitle = 'Untitled Novel'): ParsedResult {
  const { metadata, remainingText } = extractMetadata(rawText, defaultTitle);
  const chapterResult = detectChapters(remainingText);

  return {
    metadata,
    chapters: chapterResult.chapters,
    status: chapterResult.status,
    warnings: chapterResult.warnings,
    unparsedContent: chapterResult.unparsedContent,
  };
}

export async function parseDocx(buffer: Buffer, originalFilename?: string): Promise<ParsedResult> {
  const defaultTitle = originalFilename
    ? originalFilename.replace(/\.docx$/i, '').replace(/[-_]+/g, ' ')
    : 'Untitled Novel';

  try {
    // 1. Convert to raw text to reliably parse metadata and chapter boundaries
    const rawTextResult = await mammoth.extractRawText({ buffer });
    const rawText = rawTextResult.value;

    // 2. Convert to HTML for rich formatting (bold, italic, paragraphs)
    const htmlResult = await mammoth.convertToHtml({ buffer });

    // 3. Extract metadata from raw text
    const { metadata, remainingText } = extractMetadata(rawText, defaultTitle);

    // 4. Detect chapters
    // If rawText gave headings, we can detect chapters either from text or html
    const chapterResult = detectChapters(remainingText);

    // If mammoth reported any internal warnings, append them
    if (htmlResult.messages && htmlResult.messages.length > 0) {
      for (const msg of htmlResult.messages) {
        if (msg.type === 'warning') {
          chapterResult.warnings.push({
            code: 'DOCX_CONVERSION_WARNING',
            message: msg.message,
          });
        }
      }
    }

    return {
      metadata,
      chapters: chapterResult.chapters,
      status: chapterResult.status,
      warnings: chapterResult.warnings,
      unparsedContent: chapterResult.unparsedContent,
    };
  } catch (error: any) {
    return {
      metadata: {
        title: defaultTitle,
        author: 'Admin Taunovel',
        genres: [],
        language: 'Indonesia',
        status: 'ONGOING',
        description: '',
      },
      chapters: [],
      status: 'FAILED',
      warnings: [
        {
          code: 'PARSING_ERROR',
          message: error?.message || 'Gagal memproses file DOCX.',
        },
      ],
    };
  }
}

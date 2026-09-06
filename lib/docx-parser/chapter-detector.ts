import { ParsedChapter, ParseWarning, ParseStatus } from './types';
import { parseNumberString } from './utils';
import { normalizeContent } from './content-normalizer';

export interface ChapterDetectionResult {
  chapters: ParsedChapter[];
  status: ParseStatus;
  warnings: ParseWarning[];
  unparsedContent?: string;
}

// Regex to detect chapter heading in plain text or stripped HTML
const CHAPTER_REGEX =
  /^(?:bab|chapter)\s+([0-9]+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|[ivxlcdm]+)(?:\s*(?:—|–|-|:|\.)\s*(.*))?$/i;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function detectChapters(rawTextOrHtml: string): ChapterDetectionResult {
  const warnings: ParseWarning[] = [];

  // Split content into blocks (lines or paragraphs)
  const lines = rawTextOrHtml.split(/\r?\n/);
  
  interface DetectedHeading {
    lineIndex: number;
    rawLine: string;
    chapterNumber: number;
    title: string;
  }

  const headings: DetectedHeading[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const plainText = stripHtml(rawLine);
    const match = plainText.match(CHAPTER_REGEX);

    if (match) {
      const numStr = match[1];
      const parsedNum = parseNumberString(numStr);

      if (parsedNum !== null) {
        let title = match[2] ? stripHtml(match[2]).trim() : '';
        if (!title) {
          // Rule: Don't leave title empty, use e.g. "BAB 1" or plainText
          title = plainText;
        }

        headings.push({
          lineIndex: i,
          rawLine,
          chapterNumber: parsedNum,
          title,
        });
      }
    }
  }

  // If no chapters detected
  if (headings.length === 0) {
    const cleanContent = normalizeContent(rawTextOrHtml);
    return {
      chapters: cleanContent
        ? [
            {
              chapterNumber: 1,
              title: 'Bab 1 (Draft)',
              content: cleanContent,
            },
          ]
        : [],
      status: 'NEEDS_REVIEW',
      warnings: [
        {
          code: 'NO_CHAPTER_DETECTED',
          message:
            'Beberapa bagian dokumen tidak dapat dipisahkan menjadi chapter secara otomatis. Gunakan Manual Split untuk membagi chapter.',
        },
      ],
      unparsedContent: cleanContent,
    };
  }

  // Extract chapters content between headings
  const chapters: ParsedChapter[] = [];
  const numbersSeen = new Set<number>();

  for (let h = 0; h < headings.length; h++) {
    const current = headings[h];
    const next = headings[h + 1];

    const startIndex = current.lineIndex + 1;
    const endIndex = next ? next.lineIndex : lines.length;

    const chapterLines = lines.slice(startIndex, endIndex);
    const content = normalizeContent(chapterLines.join('\n'));

    // Check duplicate
    if (numbersSeen.has(current.chapterNumber)) {
      warnings.push({
        code: 'DUPLICATE_CHAPTER_NUMBER',
        message: `Terdapat nomor chapter duplikat: Chapter ${current.chapterNumber}.`,
        details: { chapterNumber: current.chapterNumber },
      });
    } else {
      numbersSeen.add(current.chapterNumber);
    }

    // Check empty content
    if (!content || stripHtml(content).trim().length === 0) {
      warnings.push({
        code: 'EMPTY_CHAPTER',
        message: `Chapter ${current.chapterNumber} ("${current.title}") tidak memiliki konten.`,
        details: { chapterNumber: current.chapterNumber },
      });
    }

    chapters.push({
      chapterNumber: current.chapterNumber,
      title: current.title,
      content,
    });
  }

  // Check missing chapters in sequence (e.g. 1, 2, 4 -> Chapter 3 tidak ditemukan)
  const sortedNumbers = Array.from(numbersSeen).sort((a, b) => a - b);
  if (sortedNumbers.length > 1) {
    const min = sortedNumbers[0];
    const max = sortedNumbers[sortedNumbers.length - 1];

    for (let expected = min; expected <= max; expected++) {
      if (!numbersSeen.has(expected)) {
        warnings.push({
          code: 'MISSING_CHAPTER',
          message: `Chapter ${expected} tidak ditemukan.`,
          details: { missingNumber: expected },
        });
      }
    }
  }

  // Determine status
  let status: ParseStatus = 'SUCCESS';
  if (warnings.length > 0) {
    status = 'NEEDS_REVIEW';
  }

  return {
    chapters,
    status,
    warnings,
  };
}

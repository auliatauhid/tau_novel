export interface ParsedMetadata {
  title: string;
  author: string;
  genres: string[];
  language: string;
  status: 'ONGOING' | 'COMPLETED' | 'HIATUS';
  description: string;
}

export interface ParsedChapter {
  id?: string;
  chapterNumber: number;
  title: string;
  content: string; // Sanitized HTML
  rawText?: string;
  published?: boolean;
}

export interface ParseWarning {
  code: string;
  message: string;
  details?: any;
}

export type ParseStatus = 'SUCCESS' | 'NEEDS_REVIEW' | 'FAILED';

export interface ParsedResult {
  metadata: ParsedMetadata;
  chapters: ParsedChapter[];
  status: ParseStatus;
  warnings: ParseWarning[];
  unparsedContent?: string;
}

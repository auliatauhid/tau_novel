import { ParsedMetadata } from './types';

export interface ExtractedMetadataResult {
  metadata: ParsedMetadata;
  remainingText: string;
}

export function extractMetadata(
  text: string,
  defaultTitle = 'Untitled Novel'
): ExtractedMetadataResult {
  const metadata: ParsedMetadata = {
    title: defaultTitle,
    author: 'Admin Taunovel',
    genres: [],
    language: 'Indonesia',
    status: 'ONGOING',
    description: '',
  };

  const lines = text.split(/\r?\n/);
  let metadataEnded = false;
  let remainingLinesIndex = 0;
  let isCollectingSynopsis = false;
  const synopsisBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if chapter heading starts -> metadata definitely ended
    if (
      /^(?:bab|chapter)\s+(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|[ivxlcdm]+)/i.test(
        line
      )
    ) {
      remainingLinesIndex = i;
      metadataEnded = true;
      break;
    }

    if (!line) {
      if (isCollectingSynopsis && synopsisBuffer.length > 0) {
        // Empty line might or might not end synopsis
      }
      continue;
    }

    // Skip "METADATA NOVEL" heading
    if (/^metadata(?:\s+novel)?$/i.test(line)) {
      continue;
    }

    // Match Judul Novel / Title
    const titleMatch = line.match(/^(?:judul\s*novel|judul|title)\s*:\s*(.+)$/i);
    if (titleMatch) {
      isCollectingSynopsis = false;
      const val = titleMatch[1].replace(/^\[|\]$/g, '').trim();
      if (val && !val.toUpperCase().includes('ISI JUDUL NOVEL')) {
        metadata.title = val;
      }
      continue;
    }

    // Match Penulis / Author
    const authorMatch = line.match(/^(?:penulis|pengarang|author)\s*:\s*(.+)$/i);
    if (authorMatch) {
      isCollectingSynopsis = false;
      const val = authorMatch[1].replace(/^\[|\]$/g, '').trim();
      if (val && !val.toUpperCase().includes('ISI NAMA PENULIS')) {
        metadata.author = val;
      }
      continue;
    }

    // Match Genre / Kategori
    const genreMatch = line.match(/^(?:genre|kategori|genres)\s*:\s*(.+)$/i);
    if (genreMatch) {
      isCollectingSynopsis = false;
      const val = genreMatch[1].replace(/^\[|\]$/g, '').trim();
      if (val) {
        metadata.genres = val
          .split(/[,;/]/)
          .map((g) => g.trim())
          .filter(Boolean);
      }
      continue;
    }

    // Match Bahasa / Language
    const langMatch = line.match(/^(?:bahasa|language)\s*:\s*(.+)$/i);
    if (langMatch) {
      isCollectingSynopsis = false;
      const val = langMatch[1].replace(/^\[|\]$/g, '').trim();
      if (val) {
        metadata.language = val;
      }
      continue;
    }

    // Match Status
    const statusMatch = line.match(/^(?:status)\s*:\s*(.+)$/i);
    if (statusMatch) {
      isCollectingSynopsis = false;
      const val = statusMatch[1].replace(/^\[|\]$/g, '').toLowerCase().trim();
      if (val.includes('complete') || val.includes('tamat') || val.includes('selesai')) {
        metadata.status = 'COMPLETED';
      } else if (val.includes('hiatus')) {
        metadata.status = 'HIATUS';
      } else {
        metadata.status = 'ONGOING';
      }
      continue;
    }

    // Match Sinopsis / Synopsis / Deskripsi
    const synopsisMatch = line.match(/^(?:sinopsis|synopsis|deskripsi|description)\s*:\s*(.*)$/i);
    if (synopsisMatch) {
      isCollectingSynopsis = true;
      const firstLineVal = synopsisMatch[1].replace(/^\[|\]$/g, '').trim();
      if (firstLineVal && !firstLineVal.toUpperCase().includes('ISI SINOPSIS')) {
        synopsisBuffer.push(firstLineVal);
      }
      continue;
    }

    // If currently collecting multi-line synopsis
    if (isCollectingSynopsis) {
      if (line.includes(':') && /^[a-zA-Z\s]{2,15}:/.test(line)) {
        // another field started
        isCollectingSynopsis = false;
        i--; // reprocess this line
        continue;
      }
      synopsisBuffer.push(line);
      continue;
    }
  }

  if (synopsisBuffer.length > 0) {
    metadata.description = synopsisBuffer.join('\n\n').trim();
  } else if (!metadata.description) {
    metadata.description = `Novel karya ${metadata.author}`;
  }

  const remainingText = metadataEnded ? lines.slice(remainingLinesIndex).join('\n') : text;

  return {
    metadata,
    remainingText,
  };
}

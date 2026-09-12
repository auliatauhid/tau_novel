import { parseTextOrHtml } from '../index';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('\n--- RUNNING TAUNOVEL DOCX PARSER TEST SUITE ---\n');

// TEST 1: BAB 1, BAB 2, BAB 3 -> 3 chapters
{
  const input = `
BAB 1
Isi chapter 1 dimulai di sini.

BAB 2
Isi chapter 2 berlanjut dengan seru.

BAB 3
Puncak cerita di chapter 3.
  `;
  const result = parseTextOrHtml(input);
  assert(result.chapters.length === 3, 'TEST 1: BAB 1, BAB 2, BAB 3 produces exactly 3 chapters');
  assert(result.chapters[0].chapterNumber === 1, 'TEST 1: Chapter 1 number is 1');
  assert(result.chapters[1].chapterNumber === 2, 'TEST 1: Chapter 2 number is 2');
  assert(result.chapters[2].chapterNumber === 3, 'TEST 1: Chapter 3 number is 3');
}

// TEST 2: BAB 1 — Pertemuan, BAB 2 — Rahasia -> Title extraction
{
  const input = `
BAB 1 — Pertemuan
Rey melangkah ke dalam gua yang gelap.

BAB 2 — Rahasia
Rahasia besar pedang langit akhirnya terungkap.
  `;
  const result = parseTextOrHtml(input);
  assert(result.chapters.length === 2, 'TEST 2: Extracted 2 chapters');
  assert(result.chapters[0].title === 'Pertemuan', `TEST 2: Chapter 1 title is "Pertemuan" (got: "${result.chapters[0].title}")`);
  assert(result.chapters[1].title === 'Rahasia', `TEST 2: Chapter 2 title is "Rahasia" (got: "${result.chapters[1].title}")`);
}

// TEST 3: CHAPTER 1, CHAPTER 2 -> 2 chapters
{
  const input = `
CHAPTER 1
The morning sun rose above the horizon.

CHAPTER 2
A mysterious traveler arrived at the village gate.
  `;
  const result = parseTextOrHtml(input);
  assert(result.chapters.length === 2, 'TEST 3: CHAPTER 1 and CHAPTER 2 produces 2 chapters');
}

// TEST 4: Mixed casing: Bab 1, CHAPTER 2, bab 3 -> 3 chapters
{
  const input = `
Bab 1
Awal mula perjalanan.

CHAPTER 2
Latihan di kuil kuno.

bab 3
Pertarungan sengit di tebing.
  `;
  const result = parseTextOrHtml(input);
  assert(result.chapters.length === 3, 'TEST 4: Mixed casing (Bab 1, CHAPTER 2, bab 3) produces 3 chapters');
}

// TEST 5: Tidak terdapat chapter heading -> NEEDS_REVIEW
{
  const input = `
Ini adalah sebuah dokumen teks yang panjang tanpa penanda bab sama sekali.
Hanya terdiri dari beberapa paragraf biasa.
  `;
  const result = parseTextOrHtml(input);
  assert(result.status === 'NEEDS_REVIEW', `TEST 5: Missing chapter headings returns status NEEDS_REVIEW (got: "${result.status}")`);
  assert(result.warnings.some((w) => w.code === 'NO_CHAPTER_DETECTED'), 'TEST 5: Contains NO_CHAPTER_DETECTED warning');
}

// TEST 6: Duplicate number -> Warning
{
  const input = `
BAB 1 — Awal
Isi awal cerita.

BAB 1 — Duplikat
Ini bab duplikat dengan nomor yang sama.
  `;
  const result = parseTextOrHtml(input);
  assert(result.warnings.some((w) => w.code === 'DUPLICATE_CHAPTER_NUMBER'), 'TEST 6: Duplicate chapter number triggers warning');
}

// TEST 7: Missing chapter: BAB 1, BAB 2, BAB 4 -> Warning chapter 3 tidak ditemukan
{
  const input = `
BAB 1
Cerita bagian satu.

BAB 2
Cerita bagian dua.

BAB 4
Cerita bagian empat yang melompati bab tiga.
  `;
  const result = parseTextOrHtml(input);
  const missingWarning = result.warnings.find((w) => w.code === 'MISSING_CHAPTER');
  assert(Boolean(missingWarning), 'TEST 7: Missing chapter triggers MISSING_CHAPTER warning');
  assert(
    missingWarning?.message.includes('Chapter 3 tidak ditemukan') ?? false,
    `TEST 7: Warning mentions Chapter 3 tidak ditemukan (got: "${missingWarning?.message}")`
  );
}

// TEST 8: Empty chapter -> Warning
{
  const input = `
BAB 1 — Kosong

BAB 2 — Berisi
Ini adalah bab dua yang ada isinya.
  `;
  const result = parseTextOrHtml(input);
  assert(result.warnings.some((w) => w.code === 'EMPTY_CHAPTER'), 'TEST 8: Empty chapter triggers EMPTY_CHAPTER warning');
}

// TEST 9: Cover URL Extraction and Normalization from Metadata
{
  const input = `
METADATA NOVEL
Judul Novel: Kisah Pendekar Naga
Penulis: Budi Pratama
Cover: https://drive.google.com/file/d/1a2b3c4d5e/view?usp=sharing
Genre: Action, Fantasy
Sinopsis: Petualangan pendekar mencari kitab suci.

BAB 1 — Permulaan
Di sebuah desa kecil, petualangan dimulai.
  `;
  const result = parseTextOrHtml(input);
  assert(result.metadata.title === 'Kisah Pendekar Naga', 'TEST 9: Title extracted');
  assert(
    result.metadata.coverUrl === 'https://lh3.googleusercontent.com/d/1a2b3c4d5e',
    `TEST 9: Cover extracted and normalized from GDrive link (got: "${result.metadata.coverUrl}")`
  );
  assert(result.chapters.length === 1, 'TEST 9: Chapter extracted');
}

// TEST 10: Real DOCX File Parsing from Template_Import_Novel.docx
import fs from 'fs';
import path from 'path';
import { parseDocx } from '../index';

async function testRealDocx() {
  const templatePath = path.join(process.cwd(), 'docs', 'templates', 'Template_Import_Novel.docx');
  if (fs.existsSync(templatePath)) {
    const buffer = fs.readFileSync(templatePath);
    const result = await parseDocx(buffer, 'Template_Import_Novel.docx');
    assert(result.status === 'SUCCESS', `TEST 9: Template_Import_Novel.docx status is SUCCESS (got ${result.status})`);
    assert(result.chapters.length === 2, `TEST 9: Extracted 2 chapters from template (got ${result.chapters.length})`);
    assert(result.chapters[0].title === 'Awal Pertemuan', `TEST 9: Chapter 1 title is "Awal Pertemuan" (got: "${result.chapters[0].title}")`);
    assert(result.chapters[1].title === 'Rahasia Kuno', `TEST 9: Chapter 2 title is "Rahasia Kuno" (got: "${result.chapters[1].title}")`);
  }
}

testRealDocx().then(() => {
  console.log('\n✨ ALL DOCX PARSER TESTS PASSED SUCCESSFULLY! ✨\n');
});


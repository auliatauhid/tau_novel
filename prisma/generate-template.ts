import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import fs from 'fs';
import path from 'path';

async function generateTemplate() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'METADATA NOVEL',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Judul Novel: ', bold: true }),
              new TextRun('[ISI JUDUL NOVEL]'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Penulis: ', bold: true }),
              new TextRun('[ISI NAMA PENULIS]'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Genre: ', bold: true }),
              new TextRun('Fantasy, Romance, Action'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Bahasa: ', bold: true }),
              new TextRun('Indonesia'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Status: ', bold: true }),
              new TextRun('Ongoing'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Sinopsis: ', bold: true }),
              new TextRun('Tuliskan ringkasan cerita atau sinopsis novel di sini. Cerita tentang petualangan seorang pemuda yang menemukan artefak kuno di sebuah lembah tersembunyi.'),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'BAB 1 — Awal Pertemuan',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Malam itu hujan turun sangat lebat di lereng bukit. Langit bergemuruh seolah hendak menumpahkan seluruh kemarahannya kepada bumi. Rey merapatkan jubah kainnya yang basah kuyup sembari mempercepat langkahnya menuju mulut gua pelindung.'
              ),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Di dalam gua, sebuah pendaran cahaya kebiruan tampak berkilau di antara bebatuan stalaktit purba. Tanpa ragu, Rey melangkah mendekat, merasakan degup jantungnya yang berpacu kencang.'
              ),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'BAB 2 — Rahasia Kuno',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Cahaya itu berasal dari sebilah pedang pusaka yang tertancap di altar batu pualam. Huruf-huruf runik emas menyala di sepanjang bilah baja dingin tersebut.'
              ),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                '"Akhirnya ramalan seribu tahun terpenuhi," sebuah suara lembut menggema di dalam benak Rey, memecah keheningan malam.'
              ),
            ],
            spacing: { after: 150 },
          }),
        ],
      },
    ],
  });

  const dir = path.join(process.cwd(), 'docs', 'templates');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, 'Template_Import_Novel.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
  console.log(`Successfully generated template at: ${filePath}`);
}

generateTemplate().catch(console.error);

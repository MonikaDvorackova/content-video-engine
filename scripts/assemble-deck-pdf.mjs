import fs from 'node:fs';
import path from 'node:path';
import {PDFDocument} from 'pdf-lib';

const root = process.cwd();
const slidesDir = path.join(root, 'exports', 'slides');
const outPdf = path.join(root, 'exports', 'pdf', 'govai-investor-deck.pdf');

if (!fs.existsSync(slidesDir)) {
  throw new Error(`Missing slides directory: ${slidesDir}. Run "npm run stills:deck" first.`);
}

const pngs = fs
  .readdirSync(slidesDir)
  .filter((f) => f.toLowerCase().endsWith('.png'))
  .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));

if (pngs.length === 0) {
  throw new Error(`No PNGs found in ${slidesDir}.`);
}

const pdf = await PDFDocument.create();

for (const file of pngs) {
  const bytes = fs.readFileSync(path.join(slidesDir, file));
  const img = await pdf.embedPng(bytes);
  const {width, height} = img.scale(1);
  const page = pdf.addPage([width, height]);
  page.drawImage(img, {x: 0, y: 0, width, height});
}

const out = await pdf.save();
fs.mkdirSync(path.dirname(outPdf), {recursive: true});
fs.writeFileSync(outPdf, out);

console.log(`Assembled PDF: ${outPdf}`);


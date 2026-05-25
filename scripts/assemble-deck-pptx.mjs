import fs from 'node:fs';
import path from 'node:path';
import PptxGenJS from 'pptxgenjs';

const root = process.cwd();
const slidesDir = path.join(root, 'exports', 'slides');
const outPptx = path.join(root, 'exports', 'pptx', 'govai-investor-deck.pptx');

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

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.333" x 7.5" (16:9)

for (const file of pngs) {
  const abs = path.join(slidesDir, file);
  const slide = pptx.addSlide();
  slide.addImage({path: abs, x: 0, y: 0, w: 13.333, h: 7.5});
}

fs.mkdirSync(path.dirname(outPptx), {recursive: true});
await pptx.writeFile({fileName: outPptx});

console.log(`Assembled PPTX: ${outPptx}`);


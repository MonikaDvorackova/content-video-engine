import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const entry = path.join('src', 'index.ts');
const composition = 'GovAIInvestorDeck';
const browserExecutable = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const timeoutInMilliseconds = 300000;
const concurrency = 1;

const outDir = path.join(root, 'exports', 'slides');
// Requirement: delete exports/slides before rendering
fs.rmSync(outDir, {recursive: true, force: true});
fs.mkdirSync(outDir, {recursive: true});

// Render a single still from each slide at a stable frame.
// Must match SLIDE_DURATIONS in src/deck/slides.ts (frames @ 30fps).
// Kept duplicated here (instead of importing TS) to keep this script runnable with plain Node.
const SLIDE_DURATIONS = [
  210, // Cover (7.0s)
  225, // Problem (7.5s)
  225, // Why current tooling fails (7.5s)
  510, // Demo (17.0s)
  240, // Architecture / Product (8.0s)
  295, // Market / AI Act (9.83s)
  240, // Roadmap (8.0s)
  210, // GTM (7.0s)
  204, // Team (6.8s)
  250, // Ask (8.33s)
];

const files = [
  'slide_01_cover.png',
  'slide_02_problem.png',
  'slide_03_why_current_tooling_fails.png',
  'slide_04_video_demo.png',
  'slide_05_architecture_product.png',
  'slide_06_market_ai_act.png',
  'slide_07_roadmap.png',
  'slide_08_gtm.png',
  'slide_09_team.png',
  'slide_10_ask.png',
];

const run = (args) => {
  const res = spawnSync('npx', ['remotion', ...args], {stdio: 'inherit'});
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
};

const slideStartFrame = (idx) => SLIDE_DURATIONS.slice(0, idx).reduce((a, b) => a + b, 0);

for (let i = 0; i < files.length; i++) {
  // Requirement: representative late stable frame inside the slide.
  // Capture the fully animated-in visual state: start + duration - 5
  const frame = slideStartFrame(i) + SLIDE_DURATIONS[i] - 5;
  const outFile = path.join(outDir, files[i]);
  run([
    'still',
    entry,
    composition,
    outFile,
    `--frame=${frame}`,
    '--props={"speaker":false,"staticExport":true}',
    '--image-format=png',
    `--timeout=${timeoutInMilliseconds}`,
    `--concurrency=${concurrency}`,
    `--browser-executable=${browserExecutable}`,
    '--log=warn',
  ]);
}

console.log(`\nExported ${files.length} stills to ${outDir}\n`);
const generated = fs
  .readdirSync(outDir)
  .filter((f) => f.toLowerCase().endsWith('.png'))
  .sort((a, b) => a.localeCompare(b));
console.log(generated.map((f) => path.join('exports', 'slides', f)).join('\n'));


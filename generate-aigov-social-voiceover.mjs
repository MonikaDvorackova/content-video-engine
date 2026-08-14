import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';
import {execFileSync} from 'node:child_process';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const projectRoot = process.cwd();

const tsx = path.join(
  projectRoot,
  'node_modules',
  '.bin',
  'tsx',
);

const script = execFileSync(
  tsx,
  [
    '-e',
    `
import {buildAudioBrief} from './src/creative/audio';
import {defaultRenderBrief} from './src/creative/fixtures/default-render-brief';
import {buildVoiceoverScript} from './src/creative/voiceover';

const script = buildVoiceoverScript(
  buildAudioBrief(defaultRenderBrief)
);

process.stdout.write(script.fullText);
`,
  ],
  {
    cwd: projectRoot,
    encoding: 'utf8',
  },
).trim();

if (!script) {
  throw new Error('Generated voiceover script is empty');
}

const outputDir = path.join(
  projectRoot,
  'public',
  'audio',
);

const outputPath = path.join(
  outputDir,
  'aigov-social-voiceover.mp3',
);

await fs.mkdir(outputDir, {
  recursive: true,
});

console.log(
  `Generating AIGov voiceover (${script.length} chars)...`,
);

const response = await client.audio.speech.create({
  model: 'gpt-4o-mini-tts',
  voice: 'marin',
  input: script,
  instructions: [
    'Professional technology documentary narration.',
    'Calm, intelligent, authoritative, and analytical.',
    'Natural conversational pacing.',
    'Do not sound promotional or theatrical.',
    'Use subtle pauses between paragraphs.',
    'Clearly articulate AI governance terminology.',
  ].join(' '),
  response_format: 'mp3',
});

const buffer = Buffer.from(
  await response.arrayBuffer(),
);

await fs.writeFile(
  outputPath,
  buffer,
);

console.log(
  `Voiceover written to ${outputPath}`,
);
console.log(
  `Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`,
);

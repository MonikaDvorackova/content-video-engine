import {
  execFileSync,
  spawnSync,
} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const run = (
  command,
  args,
  options = {},
) => {
  console.log();
  console.log(
    `$ ${command} ${args.join(' ')}`,
  );

  const result = spawnSync(
    command,
    args,
    {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
      ...options,
    },
  );

  if (result.status !== 0) {
    process.exit(
      result.status ?? 1,
    );
  }
};

if (!process.env.OPENAI_API_KEY) {
  console.error(
    'OPENAI_API_KEY is not set.',
  );
  process.exit(1);
}

const outputDir = path.join(
  root,
  'out',
);

fs.mkdirSync(
  outputDir,
  {
    recursive: true,
  },
);

const outputPath = path.join(
  outputDir,
  'aigov-social-video-final.mp4',
);

console.log(
  '===== AIGOV SOCIAL GENERATION =====',
);

console.log();
console.log(
  '1/5 Generate voiceover',
);

run(
  process.execPath,
  [
    'generate-aigov-social-voiceover.mjs',
  ],
);

console.log();
console.log(
  '2/5 Typecheck',
);

run(
  path.join(
    root,
    'node_modules',
    '.bin',
    'tsc',
  ),
  ['--noEmit'],
);

console.log();
console.log(
  '3/5 Creative tests',
);

for (const test of [
  'src/creative/audio.test.ts',
  'src/creative/voiceover.test.ts',
  'src/creative/director.test.ts',
  'src/creative/trends.test.ts',
  'src/creative/fixtureCheck.ts',
]) {
  run(
    path.join(
      root,
      'node_modules',
      '.bin',
      'tsx',
    ),
    [test],
  );
}

console.log();
console.log(
  '4/5 Render video',
);

run(
  path.join(
    root,
    'node_modules',
    '.bin',
    'remotion',
  ),
  [
    'render',
    'src/index.ts',
    'AIGovSocialVideo',
    outputPath,
  ],
);

console.log();
console.log(
  '5/5 Verify output',
);

const probe = (
  file,
) =>
  execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      file,
    ],
    {
      encoding: 'utf8',
    },
  ).trim();

const voiceoverPath = path.join(
  root,
  'public',
  'audio',
  'aigov-social-voiceover.mp3',
);

const audioDuration =
  probe(voiceoverPath);

const videoDuration =
  probe(outputPath);

console.log();
console.log(
  `Voiceover: ${audioDuration}s`,
);
console.log(
  `Video:     ${videoDuration}s`,
);
console.log(
  `Output:    ${outputPath}`,
);

console.log();
console.log(
  'AIGov social generation PASS',
);

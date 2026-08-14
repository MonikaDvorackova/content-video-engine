import fs from 'node:fs';

import {directStory} from './director';
import type {RenderBrief, StorySignal} from './types';
import {validateRenderBrief} from './validate';

const inputPath =
  process.argv[2] ?? '/tmp/aigov-video-story.json';

const raw = JSON.parse(
  fs.readFileSync(inputPath, 'utf8'),
) as {
  version: '1.0';
  story: StorySignal;
  publication: RenderBrief['publication'];
  brand: RenderBrief['brand'];
};

const creative = directStory(raw.story);

const brief: RenderBrief = {
  version: raw.version,
  story: raw.story,
  creative,
  brand: raw.brand,
  publication: raw.publication,
};

if (!validateRenderBrief(brief)) {
  throw new Error('Cross-repo RenderBrief validation failed');
}

console.log('===== RENDER BRIEF PASS =====');
console.log('Story:', brief.story.title);
console.log('Source type:', brief.story.sourceType);
console.log('Narrative:', brief.creative.narrativeMechanic);
console.log('Format:', brief.creative.format);
console.log('Pacing:', brief.creative.pacing);
console.log(
  'Visuals:',
  brief.creative.visualLanguages.join(' > '),
);
console.log(
  'Duration:',
  `${brief.creative.durationSeconds}s`,
);
console.log(
  'Human approval:',
  brief.publication.requiresHumanApproval,
);

import {defaultRenderBrief} from './fixtures/default-render-brief';
import {buildAudioBrief} from './audio';

const audio = buildAudioBrief(
  defaultRenderBrief,
);

if (
  audio.voiceover.segments.length !==
  defaultRenderBrief.creative.scenes.length
) {
  throw new Error(
    'Expected one voiceover segment per scene',
  );
}

const totalDuration =
  audio.voiceover.segments.reduce(
    (sum, segment) =>
      sum + segment.durationSeconds,
    0,
  );

if (
  totalDuration !==
  defaultRenderBrief.creative.durationSeconds
) {
  throw new Error(
    'Voiceover timeline must match creative duration',
  );
}

if (
  audio.voiceover.segments.some(
    (segment) => !segment.text.trim(),
  )
) {
  throw new Error(
    'Voiceover segments must contain text',
  );
}

if (!audio.captions.enabled) {
  throw new Error(
    'Captions must be enabled',
  );
}

console.log(
  `Audio Brief PASS: ${audio.voiceover.segments.length} segments, ${totalDuration}s`,
);

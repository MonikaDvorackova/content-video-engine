import {buildAudioBrief} from './audio';
import {defaultRenderBrief} from './fixtures/default-render-brief';
import {buildVoiceoverScript} from './voiceover';

const audio = buildAudioBrief(defaultRenderBrief);
const script = buildVoiceoverScript(audio);

if (script.segments.length !== 5) {
  throw new Error(`Expected 5 voiceover segments, got ${script.segments.length}`);
}

if (!script.fullText.trim()) {
  throw new Error('Voiceover script must not be empty');
}

if (script.segments.some((segment) => !segment.text)) {
  throw new Error('Every voiceover segment must contain text');
}

console.log(
  `Voiceover Script PASS: ${script.segments.length} segments, ${script.fullText.length} chars`,
);

if (script.fullText.includes('..')) {
  throw new Error(
    'Voiceover must not contain duplicate punctuation',
  );
}

for (const segment of script.segments) {
  const sentences = segment.text
    .split(/[.!?]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  for (let i = 1; i < sentences.length; i += 1) {
    if (sentences[i] === sentences[i - 1]) {
      throw new Error(
        `Duplicate adjacent sentence in ${segment.sceneId}`,
      );
    }
  }
}

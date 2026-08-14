import type {AudioBrief} from './audio';

export type VoiceoverScript = {
  fullText: string;
  segments: {
    id: string;
    sceneId: string;
    text: string;
    startSeconds: number;
    durationSeconds: number;
  }[];
};

export const buildVoiceoverScript = (
  audio: AudioBrief,
): VoiceoverScript => {
  const segments = audio.voiceover.segments.map((segment) => ({
    id: segment.id,
    sceneId: segment.sceneId,
    text: segment.text.trim(),
    startSeconds: segment.startSeconds,
    durationSeconds: segment.durationSeconds,
  }));

  return {
    fullText: segments
      .map((segment) => segment.text)
      .filter(Boolean)
      .join('\n\n'),
    segments,
  };
};

import type {
  RenderBrief,
  SceneBeat,
} from './types';

export type VoiceoverSegment = {
  id: string;
  sceneId: string;
  text: string;
  startSeconds: number;
  durationSeconds: number;
};

export type AudioBrief = {
  voiceover: {
    enabled: boolean;
    segments: VoiceoverSegment[];
  };
  captions: {
    enabled: boolean;
  };
  backgroundBed: {
    enabled: boolean;
    volume: number;
  };
};

const cleanSentence = (
  value: string | undefined,
): string =>
  (value ?? '')
    .trim()
    .replace(/[.?!]+$/g, '');

const joinSentences = (
  ...values: Array<string | undefined>
): string =>
  values
    .map(cleanSentence)
    .filter(Boolean)
    .map((value) => `${value}.`)
    .join(' ');

const sceneVoiceoverText = (
  scene: SceneBeat,
  brief: RenderBrief,
): string => {
  const title = cleanSentence(brief.story.title);
  const summary = cleanSentence(brief.story.summary);
  const whyNow = cleanSentence(brief.story.whyNow);
  const angle = cleanSentence(brief.story.storyAngle);
  const headline = cleanSentence(scene.headline);

  switch (scene.purpose) {
    case 'hook':
      return joinSentences(
        'AI agents are moving beyond assistance',
        summary,
        'That changes what governance has to observe',
      );

    case 'context':
      return joinSentences(
        'The important shift is not simply better models',
        whyNow,
        'Once an agent can act through tools and workflows, decisions begin to happen at runtime',
      );

    case 'evidence':
      return joinSentences(
        'That runtime creates a new evidence problem',
        'Teams need to know what the agent saw, which action it selected, which tool it called, and what happened next',
      );

    case 'implication':
      return joinSentences(
        angle || headline,
        'Approving a model before deployment is no longer enough when autonomous actions continue after that approval',
      );

    case 'aigov_connection':
      return joinSentences(
        'The governance boundary is moving with the technology',
        'Runtime context, agent actions, tool calls, policy checks, and decision evidence all need to remain traceable',
      );

    default:
      return [
        headline || title,
        cleanSentence(scene.body),
      ]
        .filter(Boolean)
        .join('. ') + '.';
  }
};

export const buildAudioBrief = (
  brief: RenderBrief,
): AudioBrief => {
  let cursor = 0;

  const segments = brief.creative.scenes.map(
    (scene): VoiceoverSegment => {
      const segment = {
        id: `voiceover:${scene.id}`,
        sceneId: scene.id,
        text: sceneVoiceoverText(
          scene,
          brief,
        ),
        startSeconds: cursor,
        durationSeconds:
          scene.durationSeconds,
      };

      cursor += scene.durationSeconds;

      return segment;
    },
  );

  return {
    voiceover: {
      enabled: true,
      segments,
    },
    captions: {
      enabled: true,
    },
    backgroundBed: {
      enabled: true,
      volume: 0.12,
    },
  };
};

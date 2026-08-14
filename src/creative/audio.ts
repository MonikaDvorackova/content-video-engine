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

const sceneVoiceoverText = (
  scene: SceneBeat,
  brief: RenderBrief,
): string => {
  switch (scene.purpose) {
    case 'hook':
      return [
        scene.headline,
        brief.story.summary,
      ]
        .filter(Boolean)
        .join('. ');

    case 'context':
      return [
        scene.headline,
        brief.story.whyNow,
      ]
        .filter(Boolean)
        .join('. ');

    case 'evidence':
      return [
        scene.headline,
        `The signal scores ${Math.round(
          brief.story.aigovRelevanceScore * 100,
        )} percent for AIGov relevance.`,
      ]
        .filter(Boolean)
        .join('. ');

    case 'implication':
      return [
        scene.headline,
        brief.story.storyAngle,
      ]
        .filter(Boolean)
        .join('. ');

    case 'aigov_connection':
      return [
        scene.headline,
        'Governance has to follow runtime execution, agent actions, tool calls, and decision evidence.',
      ]
        .filter(Boolean)
        .join('. ');

    default:
      return scene.body
        ? `${scene.headline ?? ''}. ${scene.body}`.trim()
        : (scene.headline ?? '');
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

import type {RenderBrief} from './types';

const isNumber01 = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= 1;

export const validateRenderBrief = (
  value: unknown,
): value is RenderBrief => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const brief = value as Partial<RenderBrief>;

  if (brief.version !== '1.0') {
    return false;
  }

  if (!brief.story || !brief.creative || !brief.brand || !brief.publication) {
    return false;
  }

  if (
    !brief.story.id ||
    !brief.story.title ||
    !brief.story.summary ||
    !brief.story.discoveredAt ||
    !brief.story.whyNow ||
    !brief.story.storyAngle
  ) {
    return false;
  }

  if (
    !isNumber01(brief.story.freshnessScore) ||
    !isNumber01(brief.story.noveltyScore) ||
    !isNumber01(brief.story.audienceInterestScore) ||
    !isNumber01(brief.story.aigovRelevanceScore)
  ) {
    return false;
  }

  if (
    !Array.isArray(brief.story.evidence) ||
    brief.story.evidence.length === 0
  ) {
    return false;
  }

  if (
    !brief.creative.hook ||
    !brief.creative.thesis ||
    !brief.creative.audience ||
    typeof brief.creative.durationSeconds !== 'number' ||
    brief.creative.durationSeconds <= 0
  ) {
    return false;
  }

  if (
    !Array.isArray(brief.creative.scenes) ||
    brief.creative.scenes.length < 2
  ) {
    return false;
  }

  const totalSceneDuration = brief.creative.scenes.reduce(
    (sum, scene) => sum + scene.durationSeconds,
    0,
  );

  if (
    Math.abs(totalSceneDuration - brief.creative.durationSeconds) > 0.01
  ) {
    return false;
  }

  if (
    brief.publication.channel !== 'linkedin' ||
    brief.publication.requiresHumanApproval !== true
  ) {
    return false;
  }

  return true;
};

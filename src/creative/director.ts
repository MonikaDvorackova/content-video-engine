import type {
  CreativeStrategy,
  NarrativeMechanic,
  Pacing,
  SceneBeat,
  StorySignal,
  VideoFormat,
  VisualLanguage,
} from './types';
import {
  scoreCreativeChoice,
  type CreativeTrendSignal,
  type RecentCreativeUsage,
} from './trends';

const clampDuration = (seconds: number): number =>
  Math.max(20, Math.min(60, seconds));

const chooseNarrative = (story: StorySignal): NarrativeMechanic => {
  switch (story.sourceType) {
    case 'news':
    case 'product_release':
      return story.freshnessScore > 0.85
        ? 'breaking_update'
        : 'reveal';

    case 'research':
      return story.noveltyScore > 0.8
        ? 'data_story'
        : 'teardown';

    case 'regulation':
      return 'timeline';

    case 'security_incident':
      return 'pov';

    case 'benchmark':
      return 'data_story';

    case 'community_discussion':
      return 'contrarian_argument';

    case 'historical':
      return 'before_after';

    case 'market_signal':
      return story.noveltyScore > 0.8
        ? 'prediction'
        : 'visual_analogy';

    case 'original_analysis':
      return 'mini_documentary';

    default:
      return 'problem_solution';
  }
};

const chooseFormat = (
  story: StorySignal,
  narrative: NarrativeMechanic,
): VideoFormat => {
  if (
    narrative === 'breaking_update' ||
    narrative === 'pov' ||
    narrative === 'contrarian_argument'
  ) {
    return 'vertical_short';
  }

  if (
    narrative === 'data_story' ||
    story.sourceType === 'benchmark'
  ) {
    return 'data_story';
  }

  if (
    narrative === 'mini_documentary' ||
    story.sourceType === 'historical'
  ) {
    return 'mini_documentary';
  }

  return 'vertical_short';
};

const choosePacing = (
  story: StorySignal,
  narrative: NarrativeMechanic,
): Pacing => {
  if (
    story.freshnessScore > 0.9 ||
    narrative === 'breaking_update'
  ) {
    return 'fast';
  }

  if (
    story.sourceType === 'research' ||
    story.sourceType === 'benchmark' ||
    story.sourceType === 'regulation'
  ) {
    return 'analytical';
  }

  if (
    narrative === 'mini_documentary' ||
    narrative === 'visual_analogy'
  ) {
    return 'cinematic';
  }

  return 'medium';
};

export interface CreativeDirectorContext {
  trends?: CreativeTrendSignal[];
  recentUsage?: RecentCreativeUsage;
}

const EMPTY_RECENT_USAGE: RecentCreativeUsage = {
  visualLanguages: [],
  narratives: [],
  formats: [],
  pacing: [],
};

const rankVisualLanguages = (
  candidates: VisualLanguage[],
  context: CreativeDirectorContext,
): VisualLanguage[] => {
  const trends = context.trends ?? [];
  const recent = context.recentUsage ?? EMPTY_RECENT_USAGE;

  return [...candidates].sort((a, b) => {
    const scoreA = scoreCreativeChoice(
      {kind: 'visual_language', value: a},
      trends,
      recent,
    );
    const scoreB = scoreCreativeChoice(
      {kind: 'visual_language', value: b},
      trends,
      recent,
    );

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    return candidates.indexOf(a) - candidates.indexOf(b);
  });
};

const chooseVisualLanguages = (
  story: StorySignal,
  context: CreativeDirectorContext,
): VisualLanguage[] => {
  switch (story.sourceType) {
    case 'research':
      return rankVisualLanguages(['documents', 'charts', 'kinetic_typography'], context);

    case 'benchmark':
      return rankVisualLanguages(['charts', 'diagram', 'kinetic_typography'], context);

    case 'regulation':
      return rankVisualLanguages(['documents', 'timeline', 'diagram'], context);

    case 'security_incident':
      return rankVisualLanguages(['terminal', 'ui_simulation', 'split_screen'], context);

    case 'product_release':
      return rankVisualLanguages(['browser', 'ui_simulation', 'kinetic_typography'], context);

    case 'community_discussion':
      return rankVisualLanguages(['cards', 'kinetic_typography', 'split_screen'], context);

    case 'historical':
      return rankVisualLanguages(['timeline', 'documents', 'cinematic'], context);

    case 'market_signal':
      return rankVisualLanguages(['cinematic', 'diagram', 'kinetic_typography'], context);

    case 'news':
      return rankVisualLanguages(['cards', 'browser', 'kinetic_typography'], context);

    case 'original_analysis':
      return rankVisualLanguages(['mixed', 'diagram', 'cinematic'], context);

    default:
      return rankVisualLanguages(['mixed'], context);
  }
};

const buildHook = (story: StorySignal): string => {
  if (story.sourceType === 'security_incident') {
    return `What happens when ${story.title.toLowerCase()}?`;
  }

  if (story.sourceType === 'research') {
    return `A new result changes how we should think about ${story.title.toLowerCase()}.`;
  }

  if (story.sourceType === 'regulation') {
    return `${story.title}. Here is what actually changes.`;
  }

  if (story.sourceType === 'benchmark') {
    return `This number matters more than it looks.`;
  }

  return story.storyAngle;
};

const buildScenes = (
  story: StorySignal,
  visualLanguages: VisualLanguage[],
  durationSeconds: number,
): SceneBeat[] => {
  const durations = [
    Math.round(durationSeconds * 0.15),
    Math.round(durationSeconds * 0.22),
    Math.round(durationSeconds * 0.22),
    Math.round(durationSeconds * 0.26),
  ];

  const used = durations.reduce((sum, value) => sum + value, 0);
  const finalDuration = durationSeconds - used;

  return [
    {
      id: 'hook',
      durationSeconds: durations[0],
      purpose: 'hook',
      headline: buildHook(story),
      visualLanguage: visualLanguages[0] ?? 'kinetic_typography',
    },
    {
      id: 'what-changed',
      durationSeconds: durations[1],
      purpose: 'context',
      headline: story.title,
      body: story.summary,
      visualLanguage: visualLanguages[1] ?? visualLanguages[0] ?? 'cards',
    },
    {
      id: 'why-now',
      durationSeconds: durations[2],
      purpose: 'evidence',
      headline: 'Why this matters now',
      body: story.whyNow,
      visualLanguage: visualLanguages[2] ?? 'diagram',
    },
    {
      id: 'angle',
      durationSeconds: durations[3],
      purpose: 'implication',
      headline: story.storyAngle,
      visualLanguage: visualLanguages[0] ?? 'kinetic_typography',
    },
    {
      id: 'close',
      durationSeconds: finalDuration,
      purpose: 'aigov_connection',
      headline:
        story.aigovRelevanceScore >= 0.65
          ? 'The governance boundary is moving with the technology.'
          : 'Watch the signal, not the hype.',
      visualLanguage: 'cinematic',
    },
  ];
};

export const directStory = (
  story: StorySignal,
  context: CreativeDirectorContext = {},
): CreativeStrategy => {
  const narrativeMechanic = chooseNarrative(story);
  const format = chooseFormat(story, narrativeMechanic);
  const pacing = choosePacing(story, narrativeMechanic);
  const visualLanguages = chooseVisualLanguages(
    story,
    context,
  );

  const baseDuration =
    story.sourceType === 'research' ||
    story.sourceType === 'regulation'
      ? 45
      : story.freshnessScore > 0.9
        ? 25
        : 30;

  const durationSeconds = clampDuration(baseDuration);

  return {
    narrativeMechanic,
    format,
    pacing,
    hook: buildHook(story),
    thesis: story.storyAngle,
    audience:
      'AI engineering, platform, security, governance and technology leaders',
    durationSeconds,
    aspectRatio: '9:16',
    visualLanguages,
    aigovConnection:
      story.aigovRelevanceScore >= 0.65
        ? 'Connect the external signal to runtime governance, accountability, evidence or control only where substantively relevant.'
        : undefined,
    scenes: buildScenes(
      story,
      visualLanguages,
      durationSeconds,
    ),
  };
};

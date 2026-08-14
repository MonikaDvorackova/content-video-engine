import type {
  CreativeTrendSignal,
  TrendDirection,
} from './trends';
import type {
  NarrativeMechanic,
  Pacing,
  VideoFormat,
  VisualLanguage,
} from './types';

export interface CreativeTrendEvidence {
  url: string;
  title: string;
  sourceType:
    | 'platform'
    | 'creator'
    | 'research'
    | 'industry_report'
    | 'editorial'
    | 'community'
    | 'internal_performance';
  observedAt: string;
}

export interface RawCreativeTrendSignal {
  id: string;
  observedAt: string;
  source: string;

  kind:
    | 'visual_language'
    | 'narrative'
    | 'format'
    | 'pacing';

  value: string;

  direction: TrendDirection;

  strength: number;
  confidence: number;

  rationale: string;
  evidence: CreativeTrendEvidence[];
}

const VISUAL_LANGUAGES: VisualLanguage[] = [
  'kinetic_typography',
  'terminal',
  'dashboard',
  'charts',
  'documents',
  'timeline',
  'split_screen',
  'cards',
  'browser',
  'code',
  'ui_simulation',
  'cinematic',
  'diagram',
  'abstract_motion',
  'mixed',
];

const NARRATIVES: NarrativeMechanic[] = [
  'breaking_update',
  'reveal',
  'timeline',
  'before_after',
  'problem_solution',
  'contrarian_argument',
  'pov',
  'simulation',
  'teardown',
  'countdown',
  'data_story',
  'question_answer',
  'prediction',
  'mini_documentary',
  'visual_analogy',
];

const FORMATS: VideoFormat[] = [
  'vertical_short',
  'square_feed',
  'landscape',
  'cinematic',
  'data_story',
  'news_bulletin',
  'screen_demo',
  'mini_documentary',
];

const PACING: Pacing[] = [
  'fast',
  'medium',
  'analytical',
  'cinematic',
  'suspense',
  'calm_expert',
];

const inRange01 = (value: number): boolean =>
  Number.isFinite(value) && value >= 0 && value <= 1;

export const normalizeCreativeTrendSignal = (
  raw: RawCreativeTrendSignal,
): CreativeTrendSignal => {
  if (!raw.id || !raw.observedAt || !raw.source) {
    throw new Error('Trend signal missing identity fields');
  }

  if (!raw.rationale.trim()) {
    throw new Error('Trend signal requires rationale');
  }

  if (!raw.evidence.length) {
    throw new Error('Trend signal requires evidence');
  }

  if (!inRange01(raw.strength) || !inRange01(raw.confidence)) {
    throw new Error(
      'Trend signal strength and confidence must be between 0 and 1',
    );
  }

  switch (raw.kind) {
    case 'visual_language':
      if (!VISUAL_LANGUAGES.includes(raw.value as VisualLanguage)) {
        throw new Error(
          `Unsupported visual language: ${raw.value}`,
        );
      }

      return {
        id: raw.id,
        observedAt: raw.observedAt,
        source: raw.source,
        target: {
          kind: 'visual_language',
          value: raw.value as VisualLanguage,
        },
        direction: raw.direction,
        strength: raw.strength,
        confidence: raw.confidence,
        rationale: raw.rationale,
      };

    case 'narrative':
      if (!NARRATIVES.includes(raw.value as NarrativeMechanic)) {
        throw new Error(
          `Unsupported narrative: ${raw.value}`,
        );
      }

      return {
        id: raw.id,
        observedAt: raw.observedAt,
        source: raw.source,
        target: {
          kind: 'narrative',
          value: raw.value as NarrativeMechanic,
        },
        direction: raw.direction,
        strength: raw.strength,
        confidence: raw.confidence,
        rationale: raw.rationale,
      };

    case 'format':
      if (!FORMATS.includes(raw.value as VideoFormat)) {
        throw new Error(
          `Unsupported format: ${raw.value}`,
        );
      }

      return {
        id: raw.id,
        observedAt: raw.observedAt,
        source: raw.source,
        target: {
          kind: 'format',
          value: raw.value as VideoFormat,
        },
        direction: raw.direction,
        strength: raw.strength,
        confidence: raw.confidence,
        rationale: raw.rationale,
      };

    case 'pacing':
      if (!PACING.includes(raw.value as Pacing)) {
        throw new Error(
          `Unsupported pacing: ${raw.value}`,
        );
      }

      return {
        id: raw.id,
        observedAt: raw.observedAt,
        source: raw.source,
        target: {
          kind: 'pacing',
          value: raw.value as Pacing,
        },
        direction: raw.direction,
        strength: raw.strength,
        confidence: raw.confidence,
        rationale: raw.rationale,
      };
  }
};

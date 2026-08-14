import type {
  NarrativeMechanic,
  Pacing,
  VideoFormat,
  VisualLanguage,
} from './types';

export type TrendDirection =
  | 'emerging'
  | 'rising'
  | 'stable'
  | 'declining'
  | 'saturated';

export interface CreativeTrendSignal {
  id: string;
  observedAt: string;
  source: string;

  target:
    | {kind: 'visual_language'; value: VisualLanguage}
    | {kind: 'narrative'; value: NarrativeMechanic}
    | {kind: 'format'; value: VideoFormat}
    | {kind: 'pacing'; value: Pacing};

  direction: TrendDirection;

  strength: number;
  confidence: number;

  rationale?: string;
}

export interface RecentCreativeUsage {
  visualLanguages: VisualLanguage[];
  narratives: NarrativeMechanic[];
  formats: VideoFormat[];
  pacing: Pacing[];
}

const directionMultiplier: Record<TrendDirection, number> = {
  emerging: 1.0,
  rising: 0.7,
  stable: 0.1,
  declining: -0.5,
  saturated: -1.0,
};

const repeatedCount = <T>(
  value: T,
  values: T[],
): number => values.filter((item) => item === value).length;

export const trendScore = (
  signal: CreativeTrendSignal,
): number =>
  directionMultiplier[signal.direction] *
  signal.strength *
  signal.confidence;

export const scoreCreativeChoice = (
  candidate: CreativeTrendSignal['target'],
  trends: CreativeTrendSignal[],
  recent: RecentCreativeUsage,
): number => {
  const matching = trends.filter(
    (trend) =>
      trend.target.kind === candidate.kind &&
      trend.target.value === candidate.value,
  );

  const marketScore = matching.reduce(
    (sum, trend) => sum + trendScore(trend),
    0,
  );

  let repetitionPenalty = 0;

  switch (candidate.kind) {
    case 'visual_language':
      repetitionPenalty =
        repeatedCount(candidate.value, recent.visualLanguages) * 0.35;
      break;

    case 'narrative':
      repetitionPenalty =
        repeatedCount(candidate.value, recent.narratives) * 0.45;
      break;

    case 'format':
      repetitionPenalty =
        repeatedCount(candidate.value, recent.formats) * 0.3;
      break;

    case 'pacing':
      repetitionPenalty =
        repeatedCount(candidate.value, recent.pacing) * 0.2;
      break;
  }

  return marketScore - repetitionPenalty;
};

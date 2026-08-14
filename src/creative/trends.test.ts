import {
  scoreCreativeChoice,
  trendScore,
  type CreativeTrendSignal,
  type RecentCreativeUsage,
} from './trends';

const trends: CreativeTrendSignal[] = [
  {
    id: '1',
    observedAt: '2026-08-14T12:00:00Z',
    source: 'test',
    target: {
      kind: 'visual_language',
      value: 'kinetic_typography',
    },
    direction: 'rising',
    strength: 0.9,
    confidence: 0.9,
  },
  {
    id: '2',
    observedAt: '2026-08-14T12:00:00Z',
    source: 'test',
    target: {
      kind: 'visual_language',
      value: 'terminal',
    },
    direction: 'saturated',
    strength: 0.9,
    confidence: 0.9,
  },
];

const recent: RecentCreativeUsage = {
  visualLanguages: [
    'terminal',
    'terminal',
    'kinetic_typography',
  ],
  narratives: [],
  formats: [],
  pacing: [],
};

const rising = trends[0];
const saturated = trends[1];

if (trendScore(rising) <= 0) {
  throw new Error('Rising trend should score positively');
}

if (trendScore(saturated) >= 0) {
  throw new Error('Saturated trend should score negatively');
}

const kineticScore = scoreCreativeChoice(
  {
    kind: 'visual_language',
    value: 'kinetic_typography',
  },
  trends,
  recent,
);

const terminalScore = scoreCreativeChoice(
  {
    kind: 'visual_language',
    value: 'terminal',
  },
  trends,
  recent,
);

if (kineticScore <= terminalScore) {
  throw new Error(
    `Expected rising creative direction to beat saturated repeated direction: ${kineticScore} <= ${terminalScore}`,
  );
}

console.log(
  `Creative Trend PASS: kinetic=${kineticScore.toFixed(3)}, terminal=${terminalScore.toFixed(3)}`,
);

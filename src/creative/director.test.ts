import {directStory} from './director';
import type {StorySignal} from './types';

const makeStory = (
  sourceType: StorySignal['sourceType'],
  overrides: Partial<StorySignal> = {},
): StorySignal => ({
  id: `story-${sourceType}`,
  sourceType,
  title: `Example ${sourceType} story`,
  summary: 'A meaningful external development occurred.',
  discoveredAt: '2026-08-14T12:00:00Z',
  freshnessScore: 0.8,
  noveltyScore: 0.8,
  audienceInterestScore: 0.8,
  aigovRelevanceScore: 0.8,
  whyNow: 'The development is relevant now.',
  storyAngle: 'This changes how production AI systems should be understood.',
  evidence: [
    {
      url: 'https://example.com',
      title: 'Example evidence',
      evidenceType: 'primary',
    },
  ],
  ...overrides,
});

const cases = {
  security: directStory(
    makeStory('security_incident', {freshnessScore: 0.96}),
  ),
  research: directStory(makeStory('research')),
  regulation: directStory(makeStory('regulation')),
  discussion: directStory(makeStory('community_discussion')),
  history: directStory(makeStory('historical')),
};

if (cases.security.narrativeMechanic !== 'pov') {
  throw new Error('Security story should select POV');
}

if (cases.research.narrativeMechanic !== 'teardown') {
  throw new Error('Research story should select teardown');
}

if (cases.regulation.narrativeMechanic !== 'timeline') {
  throw new Error('Regulation story should select timeline');
}

if (cases.discussion.narrativeMechanic !== 'contrarian_argument') {
  throw new Error(
    'Community discussion should select contrarian argument',
  );
}

if (cases.history.format !== 'mini_documentary') {
  throw new Error(
    'Historical story should select mini documentary',
  );
}

const strategies = Object.values(cases);

const narrativeCount = new Set(
  strategies.map((strategy) => strategy.narrativeMechanic),
).size;

const visualSignatureCount = new Set(
  strategies.map((strategy) =>
    strategy.visualLanguages.join(','),
  ),
).size;

if (narrativeCount < 5) {
  throw new Error(
    `Creative Director is not narratively variable enough: ${narrativeCount}`,
  );
}

if (visualSignatureCount < 5) {
  throw new Error(
    `Creative Director is not visually variable enough: ${visualSignatureCount}`,
  );
}

for (const strategy of strategies) {
  const total = strategy.scenes.reduce(
    (sum, scene) => sum + scene.durationSeconds,
    0,
  );

  if (total !== strategy.durationSeconds) {
    throw new Error(
      `Scene timing mismatch: ${total} != ${strategy.durationSeconds}`,
    );
  }
}

console.log(
  `Creative Director PASS: ${narrativeCount} narratives, ${visualSignatureCount} visual signatures`,
);

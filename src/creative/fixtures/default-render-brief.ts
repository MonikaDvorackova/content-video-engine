import {directStory} from '../director';
import type {
  RenderBrief,
  StorySignal,
} from '../types';

const story: StorySignal = {
  id: 'default-social',
  sourceType: 'research',
  title: 'AI agents are moving from assistance to execution',
  summary:
    'Production AI systems increasingly take actions through tools and workflows.',
  discoveredAt: '2026-08-14T16:00:00Z',
  freshnessScore: 0.9,
  noveltyScore: 0.8,
  audienceInterestScore: 0.8,
  aigovRelevanceScore: 0.95,
  whyNow:
    'Agent systems are increasingly gaining access to production tools.',
  storyAngle:
    'Governance has to follow execution, not stop at model approval.',
  evidence: [
    {
      url: 'https://example.test',
      title: 'Default fixture',
      evidenceType: 'secondary',
    },
  ],
};

export const defaultRenderBrief: RenderBrief = {
  version: '1.0',
  story,
  creative: directStory(story),
  brand: {
    name: 'AIGov',
    tone: 'technical',
  },
  publication: {
    channel: 'linkedin',
    requiresHumanApproval: true,
  },
};

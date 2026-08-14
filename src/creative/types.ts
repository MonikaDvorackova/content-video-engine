export type StorySourceType =
  | 'news'
  | 'research'
  | 'regulation'
  | 'security_incident'
  | 'product_release'
  | 'benchmark'
  | 'community_discussion'
  | 'market_signal'
  | 'historical'
  | 'original_analysis';

export type NarrativeMechanic =
  | 'breaking_update'
  | 'reveal'
  | 'timeline'
  | 'before_after'
  | 'problem_solution'
  | 'contrarian_argument'
  | 'pov'
  | 'simulation'
  | 'teardown'
  | 'countdown'
  | 'data_story'
  | 'question_answer'
  | 'prediction'
  | 'mini_documentary'
  | 'visual_analogy';

export type VisualLanguage =
  | 'kinetic_typography'
  | 'terminal'
  | 'dashboard'
  | 'charts'
  | 'documents'
  | 'timeline'
  | 'split_screen'
  | 'cards'
  | 'browser'
  | 'code'
  | 'ui_simulation'
  | 'cinematic'
  | 'diagram'
  | 'abstract_motion'
  | 'mixed';

export type VideoFormat =
  | 'vertical_short'
  | 'square_feed'
  | 'landscape'
  | 'cinematic'
  | 'data_story'
  | 'news_bulletin'
  | 'screen_demo'
  | 'mini_documentary';

export type Pacing =
  | 'fast'
  | 'medium'
  | 'analytical'
  | 'cinematic'
  | 'suspense'
  | 'calm_expert';

export interface EvidenceSource {
  url: string;
  title: string;
  publisher?: string;
  publishedAt?: string;
  evidenceType:
    | 'primary'
    | 'research'
    | 'official'
    | 'report'
    | 'community'
    | 'secondary';
}

export interface StorySignal {
  id: string;
  sourceType: StorySourceType;
  title: string;
  summary: string;
  discoveredAt: string;

  freshnessScore: number;
  noveltyScore: number;
  audienceInterestScore: number;
  aigovRelevanceScore: number;

  whyNow: string;
  storyAngle: string;
  evidence: EvidenceSource[];
}

export interface SceneBeat {
  id: string;
  durationSeconds: number;

  purpose:
    | 'hook'
    | 'context'
    | 'evidence'
    | 'explanation'
    | 'contrast'
    | 'reveal'
    | 'implication'
    | 'aigov_connection'
    | 'cta';

  headline?: string;
  body?: string;

  visualLanguage: VisualLanguage;

  dataPoints?: Array<{
    label: string;
    value: string;
    sourceUrl?: string;
  }>;

  assetHints?: string[];
}

export interface CreativeStrategy {
  narrativeMechanic: NarrativeMechanic;
  format: VideoFormat;
  pacing: Pacing;

  hook: string;
  thesis: string;
  audience: string;

  durationSeconds: number;
  aspectRatio: '9:16' | '1:1' | '16:9';

  visualLanguages: VisualLanguage[];

  aigovConnection?: string;
  cta?: string;

  scenes: SceneBeat[];
}

export interface RenderBrief {
  version: '1.0';

  story: StorySignal;
  creative: CreativeStrategy;

  brand: {
    name: 'AIGov';
    tone:
      | 'technical'
      | 'analytical'
      | 'editorial'
      | 'urgent'
      | 'calm'
      | 'provocative';
  };

  publication: {
    channel: 'linkedin';
    intendedPublishAt?: string;
    requiresHumanApproval: true;
  };
}

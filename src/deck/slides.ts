export const SLIDE_COUNT = 10;
export const SLIDE_DURATION = 240; // baseline only (8s @ 30fps)

// Slide durations (frames @ 30fps) tuned to match narration pacing.
// Target: <= 90s total, no narration truncation, no dead air.
export const SLIDE_DURATIONS: number[] = [
  210, // Cover (7.0s)
  225, // Problem (7.5s)
  225, // Why current tooling fails (7.5s)
  510, // Demo (17.0s)
  240, // Architecture / Product (8.0s)
  295, // Market / AI Act (9.83s)
  240, // Roadmap (8.0s)
  210, // GTM (7.0s)
  204, // Team (6.8s)
  250, // Ask (8.33s)
];

export const TOTAL_DECK_DURATION_IN_FRAMES = SLIDE_DURATIONS.reduce((a, b) => a + b, 0);

export type SlideContent = {
  title: string;
  kicker?: string;
  headline: string;
  bullets: string[];
  speakerNotes?: string[];
};

export const GOVAI_DECK_SLIDES: SlideContent[] = [
  {
    title: 'Cover',
    kicker: 'AI governance enforcement infrastructure',
    headline: 'GovAI',
    bullets: [],
    speakerNotes: [
      'GovAI is deterministic enforcement infrastructure, not a dashboard.',
      'We block non-compliant AI deployments before they reach production.',
    ],
  },
  {
    title: 'Problem',
    kicker: 'Reality',
    headline: 'Model validation does not guarantee valid production decisions',
    bullets: [
      'Models can pass evals',
      'Deployments can still ship without evidence, approvals, traceability, or governance',
    ],
    speakerNotes: [
      'Most failures are not “the model is bad” — they are integration + control failures.',
      'Enterprises need deploy-time enforcement, not after-the-fact narratives.',
    ],
  },
  {
    title: 'Why current tooling fails',
    kicker: 'Where the stack stops',
    headline: 'Everyone detects, documents, or orchestrates — nobody enforces',
    bullets: [
      'Observability detects',
      'GRC documents',
      'Eval platforms validate models',
      'CI orchestrates',
      'Nobody enforces deployment governance',
    ],
    speakerNotes: ['GovAI is the missing enforcement layer: deterministic allow/deny in the delivery path.'],
  },
  {
    title: 'Video demo',
    kicker: 'Deterministic enforcement',
    headline: 'Deterministic governance enforcement in CI.',
    bullets: [],
    speakerNotes: ['This is the core behavior: fail-closed gating with deterministic allow/deny.'],
  },
  {
    title: 'Architecture / Product',
    kicker: 'Fail-closed path',
    headline: 'PR → evidence → policy → approvals → signed decision → allow/block',
    bullets: [
      'GovAI evaluates policy deterministically against an evidence contract',
      'On allow: emits a signed decision package bound to the artifact',
      'On deny: blocks promotion with reason codes',
    ],
    speakerNotes: ['The enforcement point is promotion. The same primitive extends to runtime decision gating.'],
  },
  {
    title: 'Market / AI Act',
    kicker: 'Enforcement becomes mandatory',
    headline: 'Enterprise AI is operationalizing — governance enforcement is the missing layer',
    bullets: [
      'Teams are standardizing AI delivery (registries, evals, CI)',
      'Governance requirements exist, but enforcement is off-path',
      'AI Act accelerates audits and accountability — it does not ship controls',
      'Enforcement at promotion/runtime becomes unavoidable',
    ],
    speakerNotes: ['This is the missing layer analogous to CI gates and security policies in software.'],
  },
  {
    title: 'Roadmap',
    kicker: 'Enforcement surface area',
    headline: 'From CI gating to universal decision enforcement',
    bullets: [
      'CI enforcement',
      'Runtime decision gating',
      'Policy control plane',
      'Evidence contracts',
      'Multi-agent governance',
    ],
    speakerNotes: ['End state: a governance fabric enforcing policies wherever decisions are made.'],
  },
  {
    title: 'GTM',
    kicker: 'Design partners',
    headline: 'Go-to-market: start where enforcement is already demanded',
    bullets: [
      'Regulated enterprises shipping high-impact decision systems',
      'AI-native companies shipping fast with strict controls',
      'Platform integrations (CI, registries, approval systems)',
      'Design partner conversations in progress',
    ],
    speakerNotes: ['We sell to the platform/security/governance function that owns release gates.'],
  },
  {
    title: 'Team',
    kicker: 'Founder fit',
    headline: 'Engineering + governance depth',
    bullets: ['AI engineering', 'NLP/MLOps', 'Law + governance', 'Mathematics background'],
    speakerNotes: ['This is enforcement infrastructure: the team spans systems engineering and governance rigor.'],
  },
  {
    title: 'Ask',
    kicker: 'Raise + partners',
    headline: 'Raise to ship enforcement into production pipelines',
    bullets: [
      'Stage: pre-seed / seed',
      'Target: [fundraising target]',
      'Use of funds: CI enforcement → runtime gating → control plane',
      'CTA: design partners and platform integration partners',
    ],
    speakerNotes: ['GovAI blocks AI deployments that violate governance policy before they reach production.'],
  },
];


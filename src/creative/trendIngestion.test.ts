import {
  normalizeCreativeTrendSignal,
  type RawCreativeTrendSignal,
} from './trendIngestion';

const raw: RawCreativeTrendSignal = {
  id: 'trend-kinetic-rising',
  observedAt: '2026-08-14T16:00:00Z',
  source: 'creative-radar',
  kind: 'visual_language',
  value: 'kinetic_typography',
  direction: 'rising',
  strength: 0.9,
  confidence: 0.85,
  rationale:
    'Short-form AI content is increasingly using concise kinetic text as the primary explanatory layer.',
  evidence: [
    {
      url: 'https://example.com/evidence',
      title: 'Fixture evidence',
      sourceType: 'industry_report',
      observedAt: '2026-08-14T15:30:00Z',
    },
  ],
};

const normalized = normalizeCreativeTrendSignal(raw);

if (
  normalized.target.kind !== 'visual_language' ||
  normalized.target.value !== 'kinetic_typography'
) {
  throw new Error('Trend ingestion normalized the wrong target');
}

let unsupportedRejected = false;

try {
  normalizeCreativeTrendSignal({
    ...raw,
    id: 'bad',
    value: 'random_visual_style',
  });
} catch {
  unsupportedRejected = true;
}

if (!unsupportedRejected) {
  throw new Error('Unsupported trend values must be rejected');
}

let evidenceRejected = false;

try {
  normalizeCreativeTrendSignal({
    ...raw,
    id: 'no-evidence',
    evidence: [],
  });
} catch {
  evidenceRejected = true;
}

if (!evidenceRejected) {
  throw new Error('Evidence-free trend signals must be rejected');
}

console.log('Creative Trend Ingestion PASS');

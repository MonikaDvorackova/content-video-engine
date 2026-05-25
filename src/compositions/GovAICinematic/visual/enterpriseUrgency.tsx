import React from 'react';
import {useCinematicCut} from '../CutContext';
import {Chip} from '../components/ui';
import {CINE} from './tokens';

const LABELS = [
  'Regulated AI systems',
  'High-risk AI',
  'Post-decision review',
  'Liability exposure',
  'Incident reconstruction',
  'Audit requirements',
  'Institutional deployment',
] as const;

/** Restrained institutional context — integrated in product chrome */
export const EnterpriseUrgencyStrip: React.FC = () => {
  const {effectiveFrame, cut} = useCinematicCut();
  const idx = Math.floor(effectiveFrame / 100) % LABELS.length;
  const label = LABELS[idx];
  const secondary = LABELS[(idx + 2) % LABELS.length];

  if (cut === 'hook') {
    return (
      <div style={{display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap'}}>
        <Chip label="High-risk AI" tone="muted" />
        <Chip label="Incident reconstruction" tone="muted" />
      </div>
    );
  }

  return (
    <div style={{display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center'}}>
      <span
        style={{
          fontFamily: CINE.fontMono,
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: CINE.text3,
          marginRight: 4,
        }}
      >
        Context
      </span>
      <Chip label={label} tone="muted" />
      {cut === 'landing' ? <Chip label={secondary} tone="muted" /> : null}
    </div>
  );
};

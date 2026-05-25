import React from 'react';
import {MOCK_RUN} from '../data/mockRun';
import {CINE} from './FullScreenScene';

export const Chip: React.FC<{
  label: string;
  tone?: 'muted' | 'success' | 'warning' | 'danger';
}> = ({label, tone = 'muted'}) => {
  const s = {
    muted: {bg: 'rgba(160,175,195,0.12)', border: CINE.border, color: CINE.text2},
    success: {bg: 'rgba(134,176,146,0.18)', border: CINE.borderBright, color: CINE.success},
    warning: {bg: 'rgba(196,154,98,0.18)', border: 'rgba(196,154,98,0.4)', color: CINE.warning},
    danger: {bg: 'rgba(209,122,122,0.18)', border: 'rgba(209,122,122,0.4)', color: CINE.danger},
  }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '7px 13px',
        borderRadius: 999,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontSize: 13,
        fontFamily: CINE.fontMono,
        letterSpacing: '0.05em',
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
};

export const DataRow: React.FC<{label: string; value: string; opacity?: number}> = ({
  label,
  value,
  opacity = 1,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 20,
      opacity,
      marginBottom: 12,
      padding: '10px 0',
      borderBottom: `1px solid rgba(160,175,195,0.12)`,
    }}
  >
    <span style={{fontSize: 14, color: CINE.text3, fontFamily: CINE.fontMono}}>{label}</span>
    <span style={{fontSize: 15, color: CINE.text2, fontFamily: CINE.fontMono, textAlign: 'right'}}>
      {value}
    </span>
  </div>
);

export const Mono: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({
  children,
  color = CINE.text2,
  size = 15,
}) => <span style={{fontFamily: CINE.fontMono, color, fontSize: size}}>{children}</span>;

export const RunMetaBar: React.FC = () => (
  <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18}}>
    <Chip label={`run_id: ${MOCK_RUN.runId.slice(0, 22)}…`} tone="success" />
    <Chip label={`agent: ${MOCK_RUN.agentId}`} />
    <Chip label={MOCK_RUN.timestamp} tone="muted" />
    <Chip label={`verdict: ${MOCK_RUN.policyVerdict}`} tone="success" />
  </div>
);

export const SectionLabel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <SceneSectionLabel>{children}</SceneSectionLabel>
);

const SceneSectionLabel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: CINE.text3,
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);

export const reveal = (localFrame: number, index: number, step = 7) =>
  Math.max(0, Math.min(1, (localFrame - index * step) / 16));

export const GraphFill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'relative', height: 760, marginTop: 8, borderRadius: 12, overflow: 'hidden', border: `1px solid ${CINE.border}`}}>
    {children}
  </div>
);

import React from 'react';
import {GOVAI_TOKENS} from '../../GovAIDemo';
import {MOCK_RUN} from '../data/mockRun';
import {useRuntimeWorld} from '../visual/RuntimeWorldContext';

export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
  badge?: React.ReactNode;
}> = ({children, style, title, badge}) => (
  <div
    style={{
      background: '#222a36',
      border: `1px solid rgba(155, 168, 184, 0.38)`,
      borderRadius: GOVAI_TOKENS.radiusCard,
      boxShadow: '0 12px 28px rgba(0,0,0,0.22)',
      padding: 20,
      height: '100%',
      ...style,
    }}
  >
    {title ? (
      <PanelHeader title={title} badge={badge} />
    ) : null}
    {children}
  </div>
);

const PanelHeader: React.FC<{title: string; badge?: React.ReactNode}> = ({title, badge}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    }}
  >
    <span style={{fontWeight: 700, fontSize: 13, color: GOVAI_TOKENS.textPrimary}}>{title}</span>
    {badge}
  </div>
);

export const Chip: React.FC<{
  label: string;
  tone?: 'muted' | 'success' | 'warning' | 'danger';
}> = ({label, tone = 'muted'}) => {
  const styles = {
    muted: {
      bg: 'rgba(139,149,163,0.14)',
      border: GOVAI_TOKENS.border,
      color: GOVAI_TOKENS.textSecondary,
    },
    success: {
      bg: 'rgba(134,176,146,0.14)',
      border: 'rgba(134,176,146,0.35)',
      color: GOVAI_TOKENS.success,
    },
    warning: {
      bg: 'rgba(196,154,98,0.14)',
      border: 'rgba(196,154,98,0.35)',
      color: GOVAI_TOKENS.warning,
    },
    danger: {
      bg: 'rgba(209,122,122,0.14)',
      border: 'rgba(209,122,122,0.35)',
      color: '#d17a7a',
    },
  }[tone];

  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '5px 10px',
        borderRadius: 999,
        border: `1px solid ${styles.border}`,
        background: styles.bg,
        color: styles.color,
        fontSize: 11,
        fontFamily: GOVAI_TOKENS.fontMono,
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </span>
  );
};

export const DataRow: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
  opacity?: number;
}> = ({label, value, mono = true, opacity = 1}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, opacity, marginBottom: 8}}>
    <span style={{fontSize: 11, color: GOVAI_TOKENS.textMuted, fontFamily: GOVAI_TOKENS.fontMono}}>
      {label}
    </span>
    <span
      style={{
        fontSize: 12,
        color: GOVAI_TOKENS.textSecondary,
        fontFamily: mono ? GOVAI_TOKENS.fontMono : GOVAI_TOKENS.fontUi,
        textAlign: 'right',
        maxWidth: 340,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </span>
  </div>
);

export const Mono: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = GOVAI_TOKENS.textSecondary,
}) => <span style={{fontFamily: GOVAI_TOKENS.fontMono, color, fontSize: 12}}>{children}</span>;

export const RunMetaBar: React.FC<{highlight?: 'run' | 'agent' | 'verdict' | 'phase'}> = ({highlight}) => {
  const world = useRuntimeWorld();
  return (
    <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14}}>
      <Chip label={`run_id: ${world.runId.slice(0, 18)}…`} tone={highlight === 'run' ? 'success' : 'muted'} />
      <Chip label={`agent_id: ${MOCK_RUN.agentId}`} tone={highlight === 'agent' ? 'success' : 'muted'} />
      <Chip label={MOCK_RUN.timestamp} tone="muted" />
      <Chip label={`phase: ${world.phaseLabel}`} tone={highlight === 'phase' ? 'success' : 'muted'} />
      {world.ledgerEntries > 0 ? (
        <Chip label={`ledger: ${world.ledgerEntries}/${world.ledgerTotal}`} tone="muted" />
      ) : null}
      {highlight === 'verdict' ? (
        <Chip label={`verdict: ${world.auditVerdict}`} tone="success" />
      ) : null}
    </div>
  );
};

export const SidebarNav: React.FC<{active: string}> = ({active}) => {
  const items = ['Dashboard', 'Runs', 'Evidence', 'Policies', 'Agents', 'Audit'];
  return (
    <div
      style={{
        padding: '14px 0',
        background: '#1a212b',
        height: '100%',
        border: `1px solid ${GOVAI_TOKENS.border}`,
        borderRadius: GOVAI_TOKENS.radiusCard,
      }}
    >
      <div style={{padding: '0 16px 16px', fontWeight: 700, fontSize: 15, color: GOVAI_TOKENS.textPrimary}}>
        GovAI
      </div>
      {items.map((item) => (
        <div
          key={item}
          style={{
            padding: '10px 16px',
            fontSize: 13,
            color: item === active ? GOVAI_TOKENS.textPrimary : GOVAI_TOKENS.textMuted,
            background: item === active ? 'rgba(134,176,146,0.08)' : 'transparent',
            borderLeft: item === active ? `2px solid ${GOVAI_TOKENS.success}` : '2px solid transparent',
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

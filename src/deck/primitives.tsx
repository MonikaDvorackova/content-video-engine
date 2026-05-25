import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clsx} from 'clsx';
import type {AllowDeny} from './theme';

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({children, className, style}) => (
  <div
    className={clsx(
      'rounded-[var(--govai-radius)] border border-[color:var(--govai-border)] bg-[color:var(--govai-surface-1)] shadow-[var(--govai-shadow)]',
      className,
    )}
    style={style}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  label: string;
  tone?: 'muted' | 'success' | 'warning' | 'danger';
  className?: string;
}> = ({label, tone = 'muted', className}) => {
  const styles =
    tone === 'success'
      ? 'border-[rgba(134,176,146,0.35)] bg-[rgba(134,176,146,0.12)] text-[color:var(--govai-success)]'
      : tone === 'warning'
        ? 'border-[rgba(196,154,98,0.35)] bg-[rgba(196,154,98,0.12)] text-[color:var(--govai-warning)]'
        : tone === 'danger'
          ? 'border-[rgba(209,122,122,0.38)] bg-[rgba(209,122,122,0.12)] text-[color:var(--govai-danger)]'
          : 'border-[color:var(--govai-border)] bg-[rgba(139,149,163,0.12)] text-[color:var(--govai-text-2)]';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-[10px] py-[6px] font-mono text-[12px] leading-none tracking-[0.01em]',
        styles,
        className,
      )}
    >
      {label}
    </span>
  );
};

export const ReasonCode: React.FC<{code: string; text?: string; tone?: AllowDeny}> = ({
  code,
  text,
  tone = 'neutral',
}) => {
  const t =
    tone === 'allow'
      ? 'border-[rgba(134,176,146,0.32)] bg-[rgba(134,176,146,0.10)] text-[color:var(--govai-success)]'
      : tone === 'deny'
        ? 'border-[rgba(209,122,122,0.34)] bg-[rgba(209,122,122,0.10)] text-[color:var(--govai-danger)]'
        : 'border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.08)] text-[color:var(--govai-text-2)]';
  return (
    <div className="flex items-start gap-3">
      <span className={clsx('rounded-[10px] border px-3 py-2 font-mono text-[12px] leading-none', t)}>
        {code}
      </span>
      {text ? <div className="pt-[2px] text-[14px] leading-[1.35] text-[color:var(--govai-text-2)]">{text}</div> : null}
    </div>
  );
};

export const Gate: React.FC<{
  state: AllowDeny;
  label?: string;
  className?: string;
}> = ({state, label = 'Governance gate', className}) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.min(1, frame / 28));
  const scan = 0.18 + 0.12 * Math.sin(frame / 14);
  const bar =
    state === 'allow'
      ? 'bg-[rgba(134,176,146,0.22)] border-[rgba(134,176,146,0.45)]'
      : state === 'deny'
        ? 'bg-[rgba(209,122,122,0.18)] border-[rgba(209,122,122,0.45)]'
        : 'bg-[rgba(139,149,163,0.10)] border-[color:var(--govai-border)]';
  const glow =
    state === 'allow'
      ? `0 0 22px rgba(134,176,146,${0.10 + scan})`
      : state === 'deny'
        ? `0 0 22px rgba(209,122,122,${0.10 + scan})`
        : `0 0 18px rgba(139,149,163,${0.08 + scan})`;
  const w = interpolate(p, [0, 1], [0.72, 1]);
  return (
    <div className={clsx('flex items-center justify-between rounded-[14px] border px-5 py-4', bar, className)} style={{boxShadow: glow, transform: `scale(${w})`}}>
      <div className="text-[13px] font-[680] tracking-[0.02em] text-[color:var(--govai-text)]">
        {label}
      </div>
      <Chip
        label={state === 'allow' ? 'ALLOW' : state === 'deny' ? 'DENY' : 'EVAL'}
        tone={state === 'allow' ? 'success' : state === 'deny' ? 'danger' : 'muted'}
      />
    </div>
  );
};

export const SignatureStamp: React.FC<{label?: string; className?: string}> = ({
  label = 'SIGNED DECISION PACKAGE',
  className,
}) => (
  <div
    className={clsx(
      'inline-flex items-center gap-3 rounded-[12px] border border-[color:var(--govai-border-subtle)] bg-[rgba(17,21,27,0.6)] px-4 py-3',
      className,
    )}
  >
    <div className="h-[10px] w-[10px] rounded-full border border-[color:var(--govai-border)] bg-[rgba(185,194,204,0.14)]" />
    <div className="font-mono text-[12px] tracking-[0.14em] text-[color:var(--govai-text-2)]">
      {label}
    </div>
  </div>
);

export const EvidenceChain: React.FC<{
  items: string[];
  active?: number;
  className?: string;
}> = ({items, active = items.length, className}) => {
  const frame = useCurrentFrame();
  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      {items.map((it, i) => {
        const on = i < active;
        const pulse = 0.4 + 0.6 * Math.sin((frame - i * 7) / 14);
        const opacity = on ? 1 : 0.38;
        const border = on ? 'border-[rgba(134,176,146,0.28)]' : 'border-[color:var(--govai-border-subtle)]';
        const bg = on ? 'bg-[rgba(134,176,146,0.08)]' : 'bg-[rgba(139,149,163,0.06)]';
        const dotBg = on ? `rgba(134,176,146,${0.22 + 0.18 * pulse})` : 'rgba(139,149,163,0.14)';
        return (
          <div key={it} className={clsx('flex items-center gap-3 rounded-[12px] border px-4 py-3', border, bg)} style={{opacity}}>
            <div className="h-[10px] w-[10px] rounded-full border border-[color:var(--govai-border)]" style={{background: dotBg}} />
            <div className="text-[14px] text-[color:var(--govai-text-2)]">{it}</div>
          </div>
        );
      })}
    </div>
  );
};

export type PipelineStep = {
  label: string;
  state: AllowDeny;
  note?: string;
};

export const CIPipeline: React.FC<{
  steps: PipelineStep[];
  highlightIndex?: number;
  className?: string;
}> = ({steps, highlightIndex = steps.length - 1, className}) => {
  const frame = useCurrentFrame();
  const scan = 0.18 + 0.12 * Math.sin(frame / 18);
  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center gap-3">
        {steps.map((s, i) => {
          const active = i === highlightIndex;
          const tone = s.state === 'allow' ? 'success' : s.state === 'deny' ? 'danger' : 'muted';
          const border =
            s.state === 'allow'
              ? 'border-[rgba(134,176,146,0.35)]'
              : s.state === 'deny'
                ? 'border-[rgba(209,122,122,0.35)]'
                : 'border-[color:var(--govai-border-subtle)]';
          const bg =
            s.state === 'allow'
              ? 'bg-[rgba(134,176,146,0.08)]'
              : s.state === 'deny'
                ? 'bg-[rgba(209,122,122,0.08)]'
                : 'bg-[rgba(139,149,163,0.05)]';
          const shadow = active ? `0 0 18px rgba(185,194,204,${0.08 + scan})` : 'none';
          return (
            <React.Fragment key={s.label}>
              <div className={clsx('min-w-[180px] flex-1 rounded-[14px] border px-4 py-3', border, bg)} style={{boxShadow: shadow}}>
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-[680] text-[color:var(--govai-text)]">{s.label}</div>
                  <Chip label={s.state === 'allow' ? 'OK' : s.state === 'deny' ? 'BLOCK' : '…'} tone={tone} />
                </div>
                {s.note ? <div className="mt-2 text-[12px] text-[color:var(--govai-text-3)]">{s.note}</div> : null}
              </div>
              {i < steps.length - 1 ? (
                <div className="h-[1px] w-[26px] bg-[color:var(--govai-border-subtle)]" />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};


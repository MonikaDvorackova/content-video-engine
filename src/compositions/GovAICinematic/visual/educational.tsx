import React from 'react';
import {GOVAI_TOKENS} from '../../GovAIDemo';
import {activeStep, phase, scrollY} from './motion';
import {reveal} from './ui';
import {CINE} from './tokens';

export const SectionBanner: React.FC<{
  label: string;
  title: string;
  localFrame: number;
}> = ({label, title, localFrame}) => (
  <div
    style={{
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: `1px solid ${CINE.border}`,
      opacity: reveal(localFrame, 0, 10),
    }}
  >
    <div
      style={{
        fontFamily: CINE.fontMono,
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: CINE.success,
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div style={{fontSize: 22, fontWeight: 700, color: CINE.text, letterSpacing: '-0.02em'}}>{title}</div>
  </div>
);

export const ExplainerLine: React.FC<{
  text: string;
  localFrame: number;
  index: number;
}> = ({text, localFrame, index}) => (
  <div
    style={{
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      marginBottom: 10,
      opacity: reveal(localFrame, index, 8),
    }}
  >
    <div style={{width: 6, height: 6, borderRadius: 99, background: CINE.success, marginTop: 8, flexShrink: 0}} />
    <span style={{fontSize: 15, color: CINE.text2, lineHeight: 1.45}}>{text}</span>
  </div>
);

export const CompareColumn: React.FC<{
  title: string;
  subtitle: string;
  tone: 'fail' | 'success';
  localFrame: number;
  children: React.ReactNode;
}> = ({title, subtitle, tone, localFrame, children}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      background: GOVAI_TOKENS.surfaceMid,
      border: `1px solid ${tone === 'fail' ? 'rgba(209,122,122,0.35)' : CINE.borderBright}`,
      borderRadius: GOVAI_TOKENS.radiusCard,
      padding: 18,
      opacity: reveal(localFrame, tone === 'fail' ? 0 : 2, 10),
    }}
  >
    <div style={{fontSize: 13, fontWeight: 700, color: CINE.text, marginBottom: 4}}>{title}</div>
    <div style={{fontSize: 12, color: CINE.text3, marginBottom: 14}}>{subtitle}</div>
    {children}
  </div>
);

export const ArchitectureLayer: React.FC<{
  label: string;
  detail: string;
  active: boolean;
  localFrame: number;
  index: number;
}> = ({label, detail, active, localFrame, index}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 18px',
      marginBottom: 10,
      background: active ? 'rgba(134,176,146,0.12)' : GOVAI_TOKENS.surfaceChrome,
      border: `1px solid ${active ? CINE.borderBright : CINE.border}`,
      borderRadius: GOVAI_TOKENS.radiusCard,
      opacity: reveal(localFrame, index, 9),
      boxShadow: active ? `0 0 0 1px ${CINE.borderBright}` : undefined,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        border: `1px solid ${active ? CINE.success : CINE.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: CINE.fontMono,
        fontSize: 14,
        color: active ? CINE.success : CINE.text3,
      }}
    >
      {index + 1}
    </div>
    <div style={{flex: 1}}>
      <div style={{fontSize: 16, fontWeight: 600, color: CINE.text}}>{label}</div>
      <div style={{fontSize: 13, color: CINE.text3, marginTop: 4}}>{detail}</div>
    </div>
    {active ? (
      <span style={{fontFamily: CINE.fontMono, fontSize: 11, color: CINE.success}}>ACTIVE</span>
    ) : null}
  </div>
);

export const ProcessStep: React.FC<{
  step: number;
  label: string;
  status: 'pending' | 'running' | 'done' | 'blocked';
  hash?: string;
  localFrame: number;
  index: number;
}> = ({step, label, status, hash, localFrame, index}) => {
  const colors = {
    pending: CINE.text3,
    running: CINE.warning,
    done: CINE.success,
    blocked: CINE.danger,
  }[status];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr auto',
        gap: 12,
        alignItems: 'center',
        padding: '12px 14px',
        marginBottom: 8,
        background: GOVAI_TOKENS.surfaceChrome,
        border: `1px solid ${status === 'running' ? CINE.borderBright : CINE.border}`,
        borderRadius: 8,
        opacity: reveal(localFrame, index, 6),
      }}
    >
      <span style={{fontFamily: CINE.fontMono, fontSize: 13, color: CINE.text3}}>{step}</span>
      <span style={{fontSize: 14, color: CINE.text}}>{label}</span>
      <span style={{fontFamily: CINE.fontMono, fontSize: 11, color: colors}}>
        {status.toUpperCase()}
        {hash ? ` · ${hash}` : ''}
      </span>
    </div>
  );
};

export const LogStream: React.FC<{lines: string[]; localFrame: number; speed?: number}> = ({
  lines,
  localFrame,
  speed = 1.6,
}) => {
  const offset = scrollY(localFrame, speed, lines.length * 28);
  return (
    <div style={{height: '100%', overflow: 'hidden', fontFamily: CINE.fontMono, fontSize: 12}}>
      <div style={{transform: `translateY(-${offset}px)`}}>
        {[...lines, ...lines].map((line, i) => (
          <div
            key={`${i}-${line}`}
            style={{
              padding: '5px 0',
              color: line.includes('ERROR') ? CINE.danger : line.includes('WARN') ? CINE.warning : CINE.text3,
              borderLeft: line.includes('ERROR') ? `2px solid ${CINE.danger}` : '2px solid transparent',
              paddingLeft: 8,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export const MetricStrip: React.FC<{
  items: {label: string; value: string}[];
  localFrame: number;
}> = ({items, localFrame}) => (
  <div style={{display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 12, marginBottom: 14}}>
    {items.map((m, i) => (
      <div
        key={m.label}
        style={{
          padding: 14,
          background: GOVAI_TOKENS.surfaceChrome,
          border: `1px solid ${CINE.border}`,
          borderRadius: 8,
          opacity: reveal(localFrame, i, 7),
        }}
      >
        <div style={{fontSize: 11, color: CINE.text3, marginBottom: 4}}>{m.label}</div>
        <div style={{fontSize: 22, fontWeight: 700, color: CINE.text}}>{m.value}</div>
      </div>
    ))}
  </div>
);

export const activeArchitectureIndex = (localFrame: number, step = 22) =>
  activeStep(localFrame, step);

export const flowPhase = (localFrame: number, start: number, len: number) =>
  phase(localFrame, start, len);

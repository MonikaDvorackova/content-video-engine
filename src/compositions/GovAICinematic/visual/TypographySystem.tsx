import React from 'react';
import {useCinematicCut} from '../CutContext';
import {prog} from '../primitives';
import {CINEMATIC_SECTIONS} from '../timing';
import {CINE} from './tokens';

/** Localized editorial panel — never full-frame blur */
const StatementPanel: React.FC<{
  children: React.ReactNode;
  opacity: number;
  align?: 'left' | 'center';
  width?: number;
}> = ({children, opacity, align = 'left', width = 680}) => (
  <div
    style={{
      position: 'absolute',
      left: align === 'left' ? CINE.safeSide : '50%',
      bottom: 112,
      transform: align === 'center' ? 'translateX(-50%)' : undefined,
      width,
      maxWidth: 'min(680px, calc(100% - 96px))',
      opacity,
      zIndex: 20,
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        padding: '22px 28px',
        borderRadius: 12,
        background: CINE.scrim,
        border: `1px solid ${CINE.border}`,
        boxShadow: CINE.shadow,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </div>
  </div>
);

export const EditorialStatement: React.FC<{
  children: React.ReactNode;
  opacity: number;
  size?: 'lg' | 'md';
}> = ({children, opacity, size = 'lg'}) => (
  <StatementPanel opacity={opacity} width={size === 'md' ? 720 : 680}>
    <p
      style={{
        margin: 0,
        fontFamily: CINE.fontUi,
        fontSize: size === 'lg' ? 34 : 26,
        fontWeight: 500,
        lineHeight: 1.32,
        letterSpacing: '-0.02em',
        color: CINE.text,
      }}
    >
      {children}
    </p>
  </StatementPanel>
);

export const TypographyOverlay: React.FC = () => {
  const {cut, frame, effectiveFrame} = useCinematicCut();
  const {start, end} = CINEMATIC_SECTIONS.governanceFails;
  const duration = end - start;
  const statements = [
    {text: 'Logs are not evidence.', from: 0.22, to: 0.38},
    {text: 'Observability is not accountability.', from: 0.38, to: 0.55},
    {text: 'Explainability is not reconstructibility.', from: 0.55, to: 0.82},
  ] as const;

  let active: (typeof statements)[number] | null = null;
  let opacity = 0;
  if (cut === 'master') {
    for (const s of statements) {
      const sStart = start + duration * s.from;
      const sEnd = start + duration * s.to;
      const hold = prog(effectiveFrame, sStart, sStart + 14) * (1 - prog(effectiveFrame, sEnd - 18, sEnd));
      if (hold > opacity) {
        opacity = hold;
        active = s;
      }
    }
  }

  const multiStart = CINEMATIC_SECTIONS.multiAgent.start;
  const multiProg =
    cut === 'master' && effectiveFrame >= multiStart && effectiveFrame < CINEMATIC_SECTIONS.multiAgent.end - 20
      ? Math.min(1, (effectiveFrame - multiStart - 20) / 60)
      : 0;

  const landingSplitHold =
    cut === 'landing' && frame >= 45 && frame < 260
      ? prog(frame, 45, 58) * (1 - prog(frame, 240, 258))
      : 0;

  const masterSplitHold =
    cut === 'master' && effectiveFrame >= 520 && effectiveFrame < 620
      ? prog(effectiveFrame, 520, 536) * (1 - prog(effectiveFrame, 600, 616))
      : 0;

  const splitHold = Math.max(landingSplitHold, masterSplitHold);

  const shiftHold =
    cut === 'master' && effectiveFrame >= CINEMATIC_SECTIONS.shift.start && effectiveFrame < CINEMATIC_SECTIONS.shift.end - 40
      ? Math.min(1, (effectiveFrame - CINEMATIC_SECTIONS.shift.start) / 70)
      : 0;

  return (
    <>
      {shiftHold > 0.05 ? (
        <StatementPanel opacity={shiftHold} width={520}>
          {['Agents delegate.', 'Tools chain.', 'Humans lose visibility.'].map((line, i) => {
            const p = Math.min(1, shiftHold * 3 - i * 0.55);
            return (
              <p key={line} style={{margin: '0 0 8px', fontSize: 20, color: CINE.text2, opacity: p, lineHeight: 1.4}}>
                {line}
              </p>
            );
          })}
        </StatementPanel>
      ) : null}
      {active && opacity > 0.05 ? <EditorialStatement opacity={opacity}>{active.text}</EditorialStatement> : null}
      {splitHold > 0.05 ? (
        <EditorialStatement opacity={splitHold} size="md">
          GovAI reconstructs decisions. Traditional systems only observe fragments.
        </EditorialStatement>
      ) : null}
      {multiProg > 0.05 ? (
        <StatementPanel opacity={multiProg} align="center" width={760}>
          <p style={{margin: 0, fontSize: 20, lineHeight: 1.45, color: CINE.text2, textAlign: 'center'}}>
            Every action attributable. Every delegation traceable. Every decision reconstructible.
          </p>
        </StatementPanel>
      ) : null}
    </>
  );
};

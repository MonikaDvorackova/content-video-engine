import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {useCinematicCut} from '../CutContext';
import {getWalkthroughStep, interpolateCursor} from '../data/guidedWalkthrough';
import {CINE} from './tokens';

const ease = Easing.bezier(0.33, 0, 0.2, 1);

const CURSOR_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 3L19 12L11 13.5L9 20L5 3Z"
      fill="#f4f3f0"
      stroke="rgba(0,0,0,0.3)"
      strokeWidth="1"
    />
  </svg>
);

export const ProductCursorLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {effectiveFrame, cut} = useCinematicCut();
  const step = getWalkthroughStep(effectiveFrame);
  const cursor = interpolateCursor(effectiveFrame, step);
  const clickPulse =
    cursor.phase === 'click'
      ? interpolate((frame % 24) / 24, [0, 0.45, 1], [0, 1, 0], {easing: ease})
      : 0;

  if (cut === 'hook' && !step.focus) return null;

  return (
    <>
      {step.focus ? (
        <FocusRing
          x={step.focus.x}
          y={step.focus.y}
          w={step.focus.w}
          h={step.focus.h}
          label={step.focus.label}
          active={cursor.phase === 'hover' || cursor.phase === 'click' || cursor.phase === 'select'}
          frame={frame}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: cursor.x,
          top: cursor.y,
          zIndex: 50,
          pointerEvents: 'none',
          transform: `scale(${cursor.phase === 'click' ? 0.94 : 1})`,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
          transition: 'transform 0.12s ease',
        }}
      >
        {CURSOR_SVG}
        {clickPulse > 0.1 ? (
          <div
            style={{
              position: 'absolute',
              left: 3,
              top: 3,
              width: 24,
              height: 24,
              borderRadius: 99,
              border: `2px solid ${CINE.success}`,
              opacity: clickPulse * 0.7,
              transform: `scale(${1 + clickPulse * 0.4})`,
            }}
          />
        ) : null}
      </div>
      {cursor.phase === 'scrub' ? <ScrubIndicator x={cursor.x} y={cursor.y + 22} frame={frame} /> : null}
    </>
  );
};

const FocusRing: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  active: boolean;
  frame: number;
}> = ({x, y, w, h, label, active, frame}) => {
  const pulse = active ? 0.85 + Math.sin(frame / 18) * 0.15 : 0.5;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 10,
        border: `${active ? 2 : 1}px solid ${active ? CINE.borderBright : CINE.border}`,
        boxShadow: active ? `inset 0 0 0 1px rgba(143,196,154,0.1)` : undefined,
        background: active ? `rgba(143,196,154,${0.03 * pulse})` : 'transparent',
        zIndex: 45,
        pointerEvents: 'none',
      }}
    >
      {label ? (
        <div
          style={{
            position: 'absolute',
            top: -24,
            left: 10,
            fontFamily: CINE.fontMono,
            fontSize: 10,
            color: CINE.success,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: pulse,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

const ScrubIndicator: React.FC<{x: number; y: number; frame: number}> = ({x, y, frame}) => {
  const pos = interpolate(frame % 72, [0, 72], [0, 180], {easing: ease});
  return (
    <div style={{position: 'absolute', left: x - 36, top: y, width: 220, zIndex: 48}}>
      <div style={{height: 3, background: CINE.border, borderRadius: 4}} />
      <div
        style={{
          position: 'absolute',
          left: pos,
          top: -5,
          width: 10,
          height: 10,
          borderRadius: 99,
          background: CINE.success,
        }}
      />
    </div>
  );
};

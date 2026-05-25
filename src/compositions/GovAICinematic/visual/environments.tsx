import React from 'react';
import type {EnvironmentVariant} from './tokens';
import {CINE} from './tokens';

const TINT: Record<EnvironmentVariant, string> = {
  neutral: CINE.bg,
  operations: '#131820',
  topology: '#12171f',
  telemetry: '#141820',
  audit: '#131820',
  ledger: '#12161e',
  policy: '#141a24',
  institutional: '#12161e',
};

export const CinematicEnvironment: React.FC<{
  variant: EnvironmentVariant;
  localFrame?: number;
  parallax?: number;
}> = ({variant}) => (
  <div style={{position: 'absolute', inset: 0, background: TINT[variant]}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(143,196,154,0.06), transparent 55%)',
      }}
    />
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, opacity: 0.42}} aria-hidden>
      <defs>
        <pattern id="govai-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke={CINE.grid} strokeWidth="0.9" />
        </pattern>
      </defs>
      <rect width="1920" height="1080" fill="url(#govai-grid)" />
    </svg>
  </div>
);

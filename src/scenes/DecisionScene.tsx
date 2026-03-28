import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../compositions/GovAIHeroVideo';

export const DecisionScene: React.FC<{
  decision: {status: 'approved' | 'blocked'; title: string; reason: string};
}> = ({decision}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const inProgress = spring({
    fps,
    frame,
    config: {damping: 170, stiffness: 120},
  });

  const scale = interpolate(inProgress, [0, 1], [0.96, 1]);
  const glowColor =
    decision.status === 'approved' ? 'rgba(79, 200, 142, 0.20)' : 'rgba(122, 162, 255, 0.18)';

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 160px',
      }}
    >
      <div
        style={{
          width: 1240,
          borderRadius: 40,
          padding: 44,
          border: `1px solid ${theme.borderStrong}`,
          background: `
            radial-gradient(circle at 50% 0%, ${glowColor}, transparent 42%),
            linear-gradient(180deg, rgba(24, 38, 71, 0.86), rgba(14, 22, 42, 0.86))
          `,
          boxShadow: '0 34px 120px rgba(0,0,0,0.34)',
          transform: `scale(${scale})`,
          opacity: inProgress,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: theme.textDim,
            fontSize: 22,
            letterSpacing: 6,
            fontWeight: 700,
            marginBottom: 22,
          }}
        >
          DECISION STATE
        </div>

        <div
          style={{
            textAlign: 'center',
            fontSize: 74,
            lineHeight: 1.06,
            fontWeight: 700,
            letterSpacing: -2.2,
            color: theme.text,
            marginBottom: 20,
          }}
        >
          {decision.title}
        </div>

        <div
          style={{
            textAlign: 'center',
            fontSize: 38,
            lineHeight: 1.24,
            fontWeight: 500,
            color: theme.textSoft,
          }}
        >
          {decision.reason}
        </div>
      </div>
    </AbsoluteFill>
  );
};
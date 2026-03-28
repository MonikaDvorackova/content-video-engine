import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../compositions/GovAIHeroVideo';

export const MobilePromptScene: React.FC<{prompt: string}> = ({prompt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const inProgress = spring({
    fps,
    frame,
    config: {damping: 170, stiffness: 120},
  });

  const scale = interpolate(inProgress, [0, 1], [0.94, 1]);
  const translateY = interpolate(inProgress, [0, 1], [22, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 0',
      }}
    >
      <div
        style={{
          width: 620,
          borderRadius: 42,
          border: `1px solid ${theme.borderStrong}`,
          background: `
            linear-gradient(180deg, rgba(32, 49, 88, 0.88), rgba(19, 30, 59, 0.88))
          `,
          boxShadow: `
            0 30px 120px rgba(0, 0, 0, 0.34),
            0 0 0 1px rgba(255, 255, 255, 0.02) inset
          `,
          padding: 32,
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity: inProgress,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: 3,
              color: theme.textDim,
              fontWeight: 700,
            }}
          >
            MOBILE COMMAND
          </div>

          <div
            style={{
              width: 72,
              height: 10,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.08)',
            }}
          />
        </div>

        <div
          style={{
            borderRadius: 28,
            border: `1px solid ${theme.border}`,
            background: 'rgba(255,255,255,0.03)',
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: theme.textDim,
              marginBottom: 12,
            }}
          >
            Prompt
          </div>

          <div
            style={{
              fontSize: 34,
              lineHeight: 1.28,
              fontWeight: 600,
              color: theme.text,
            }}
          >
            {prompt}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
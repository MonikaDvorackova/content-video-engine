import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../compositions/GovAIHeroVideo';

export const HookScene: React.FC<{lines: string[]}> = ({lines}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 200,
      stiffness: 120,
    },
  });

  const translateY = interpolate(progress, [0, 1], [26, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 140px 140px 140px',
        opacity: progress,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: 1220,
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            fontWeight: 700,
            color: theme.textDim,
            marginBottom: 30,
          }}
        >
          GOVAI
        </div>

        <div
          style={{
            fontSize: 96,
            lineHeight: 1.02,
            fontWeight: 650,
            letterSpacing: -3.5,
            color: theme.text,
            textShadow: '0 10px 40px rgba(0, 0, 0, 0.28)',
          }}
        >
          {lines[0]}
        </div>

        <div
          style={{
            marginTop: 26,
            fontSize: 44,
            lineHeight: 1.24,
            fontWeight: 500,
            color: theme.textSoft,
          }}
        >
          {lines[1]}
        </div>
      </div>
    </AbsoluteFill>
  );
};
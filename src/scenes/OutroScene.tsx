import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../compositions/GovAIHeroVideo';

export const OutroScene: React.FC<{
  outro: {headline: string; subheadline: string};
}> = ({outro}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const inProgress = spring({
    fps,
    frame,
    config: {damping: 170, stiffness: 120},
  });

  const translateY = interpolate(inProgress, [0, 1], [18, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 140px',
        opacity: inProgress,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{textAlign: 'center', maxWidth: 1200}}>
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            fontWeight: 700,
            color: theme.textDim,
            marginBottom: 28,
          }}
        >
          GOVAI
        </div>

        <div
          style={{
            fontSize: 82,
            lineHeight: 1.04,
            fontWeight: 700,
            letterSpacing: -2.8,
            color: theme.text,
          }}
        >
          {outro.headline}
        </div>

        <div
          style={{
            fontSize: 38,
            color: theme.textSoft,
            marginTop: 22,
            fontWeight: 500,
          }}
        >
          {outro.subheadline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
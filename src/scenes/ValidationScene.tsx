import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../compositions/GovAIHeroVideo';

export const ValidationScene: React.FC<{checks: string[]}> = ({checks}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: '0 160px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1520,
          margin: '0 auto',
          borderRadius: 44,
          border: `1px solid ${theme.border}`,
          background: 'rgba(18, 28, 55, 0.54)',
          boxShadow: '0 30px 100px rgba(0,0,0,0.28)',
          padding: '38px 40px 42px 40px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: theme.textDim,
            fontSize: 22,
            letterSpacing: 6,
            fontWeight: 700,
            marginBottom: 30,
          }}
        >
          VALIDATION
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 22,
          }}
        >
          {checks.map((check, index) => {
            const start = index * 16;
            const opacity = interpolate(frame, [start, start + 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            const translateY = interpolate(frame, [start, start + 14], [24, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={check}
                style={{
                  borderRadius: 28,
                  minHeight: 180,
                  padding: 28,
                  border: `1px solid ${theme.border}`,
                  background: theme.panel,
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 24,
                    margin: '0 auto 20px auto',
                    border: `1px solid ${theme.border}`,
                    background: theme.accentSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.accent,
                    fontSize: 34,
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    fontSize: 34,
                    lineHeight: 1.24,
                    fontWeight: 600,
                    color: theme.text,
                  }}
                >
                  {check}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
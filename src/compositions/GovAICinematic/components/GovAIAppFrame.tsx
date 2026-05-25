import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GOVAI_TOKENS} from '../../GovAIDemo';
import {clamp01, prog} from '../primitives';
import {SidebarNav} from './ui';

export const GovAIAppFrame: React.FC<{
  activeNav: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  cameraY?: number;
  cameraScale?: number;
  opacity?: number;
}> = ({
  activeNav,
  title,
  subtitle,
  children,
  cameraY = 0,
  cameraScale = 1,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      opacity,
      transform: `translateY(${cameraY}px) scale(${cameraScale})`,
      transformOrigin: '50% 50%',
    }}
  >
    <div style={{position: 'absolute', left: 28, top: 24, right: 28, bottom: 24, display: 'flex', gap: 16}}>
      <SidebarColumn activeNav={activeNav} />
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0}}>
        <div style={{marginBottom: 16}}>
          <div style={{fontWeight: 700, fontSize: 24, color: GOVAI_TOKENS.textPrimary, letterSpacing: '-0.02em'}}>
            {title}
          </div>
          {subtitle ? (
            <div style={{marginTop: 6, fontSize: 14, color: GOVAI_TOKENS.textMuted}}>{subtitle}</div>
          ) : null}
        </div>
        <div style={{flex: 1, minHeight: 0}}>{children}</div>
      </div>
    </div>
  </div>
);

const SidebarColumn: React.FC<{activeNav: string}> = ({activeNav}) => (
  <div style={{width: 200, flexShrink: 0}}>
    <SidebarNav active={activeNav} />
  </div>
);

export type SceneBeat = {
  from: number;
  duration: number;
  render: (localFrame: number, opacity: number) => React.ReactNode;
};

export const SceneOrchestrator: React.FC<{
  sectionStart: number;
  beats: SceneBeat[];
  crossfade?: number;
}> = ({sectionStart, beats, crossfade = 18}) => {
  const frame = useCurrentFrame();

  return (
    <>
      {beats.map((beat, i) => {
        const beatStart = sectionStart + beat.from;
        const beatEnd = beatStart + beat.duration;
        if (frame < beatStart - crossfade || frame > beatEnd + crossfade) return null;

        const fadeIn = prog(frame, beatStart, beatStart + crossfade);
        const fadeOut = 1 - prog(frame, beatEnd - crossfade, beatEnd);
        const opacity = fadeIn * fadeOut;
        const localFrame = frame - beatStart;

        return (
          <SceneLayer key={i} opacity={opacity}>
            {beat.render(localFrame, opacity)}
          </SceneLayer>
        );
      })}
    </>
  );
};

const SceneLayer: React.FC<{children: React.ReactNode; opacity: number}> = ({
  children,
  opacity,
}) => <div style={{position: 'absolute', inset: 0, opacity}}>{children}</div>;

export const useSlowCamera = (localFrame: number, duration: number) => ({
  cameraY: interpolate(localFrame, [0, duration], [12, -8], {extrapolateRight: 'clamp'}),
  cameraScale: interpolate(localFrame, [0, duration], [1.0, 1.04], {extrapolateRight: 'clamp'}),
});

export const revealStagger = (localFrame: number, index: number, step = 8) =>
  clamp01((localFrame - index * step) / 14);

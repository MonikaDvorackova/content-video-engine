import React from 'react';
import {interpolate} from 'remotion';
import {CinematicEnvironment} from './environments';
import type {EnvironmentVariant} from './tokens';
import {CINE} from './tokens';

const NAV = ['Dashboard', 'Runs', 'Evidence', 'Policies', 'Agents', 'Audit'];

/** Institutional observer camera — almost static, max scale 1.05 */
export const useSceneCamera = (localFrame: number, duration: number, enabled = true) => {
  if (!enabled) return {scale: 1, x: 0, y: 0};
  return {
    scale: interpolate(localFrame, [0, duration], [1, 1.03], {extrapolateRight: 'clamp'}),
    y: interpolate(localFrame, [0, duration], [1, -2], {extrapolateRight: 'clamp'}),
    x: interpolate(localFrame, [0, duration], [-0.5, 0.5], {extrapolateRight: 'clamp'}),
  };
};

export const FullScreenScene: React.FC<{
  env: EnvironmentVariant;
  localFrame: number;
  activeNav: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  duration?: number;
  staticFrame?: boolean;
}> = ({env, localFrame, activeNav, title, subtitle, children, duration = 180, staticFrame = false}) => {
  const cam = useSceneCamera(localFrame, duration, !staticFrame);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <CinematicEnvironment variant={env} localFrame={localFrame} parallax={staticFrame ? 0.25 : 0.45} />
      <SceneCamera cam={cam}>
        <TopBar activeNav={activeNav} title={title} subtitle={subtitle} />
        <MainGlassPanel>{children}</MainGlassPanel>
      </SceneCamera>
    </div>
  );
};

const SceneCamera: React.FC<{
  cam: {x: number; y: number; scale: number};
  children: React.ReactNode;
}> = ({cam, children}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
      transformOrigin: '50% 45%',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 36px 32px',
    }}
  >
    {children}
  </div>
);

const TopBar: React.FC<{activeNav: string; title: string; subtitle?: string}> = ({
  activeNav,
  title,
  subtitle,
}) => (
  <div style={{marginBottom: 18, flexShrink: 0}}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <span style={{fontWeight: 800, fontSize: 20, color: CINE.text, letterSpacing: '0.04em'}}>GovAI</span>
        <div style={{display: 'flex', gap: 6}}>
          {NAV.map((item) => (
            <span
              key={item}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: item === activeNav ? CINE.text : CINE.text3,
                background: item === activeNav ? 'rgba(134,176,146,0.16)' : 'rgba(160,175,195,0.06)',
                border: `1px solid ${item === activeNav ? CINE.borderBright : CINE.border}`,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <span style={{fontFamily: CINE.fontMono, fontSize: 13, color: CINE.text3}}>RUNTIME · LIVE</span>
    </div>
    <div style={{marginTop: 14, fontWeight: 700, fontSize: 34, color: CINE.text, letterSpacing: '-0.025em'}}>
      {title}
    </div>
    {subtitle ? (
      <div style={{marginTop: 8, fontSize: 17, color: CINE.text3, fontWeight: 500}}>{subtitle}</div>
    ) : null}
  </div>
);

const MainGlassPanel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      background: CINE.surfaceGlass,
      border: `1px solid ${CINE.border}`,
      borderRadius: CINE.radius,
      boxShadow: CINE.shadow,
      padding: 26,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

export {CINE};

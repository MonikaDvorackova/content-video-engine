import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GOVAI_TOKENS} from '../../GovAIDemo';
import {GovAIAppFrame} from '../components/GovAIAppFrame';
import {useCinematicCut} from '../CutContext';
import {getWalkthroughStep} from '../data/guidedWalkthrough';
import {CinematicEnvironment} from './environments';
import {EnterpriseUrgencyStrip} from './enterpriseUrgency';
import {CINE} from './tokens';
import type {EnvironmentVariant} from './tokens';

const Breadcrumb: React.FC<{parts: string[]}> = ({parts}) => (
  <div style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap'}}>
    {parts.map((p, i) => (
      <React.Fragment key={`${p}-${i}`}>
        {i > 0 ? <span style={{color: CINE.text3, fontSize: 12}}>/</span> : null}
        <span
          style={{
            fontFamily: CINE.fontMono,
            fontSize: 12,
            color: i === parts.length - 1 ? CINE.text : CINE.text3,
            fontWeight: i === parts.length - 1 ? 600 : 400,
          }}
        >
          {p}
        </span>
      </React.Fragment>
    ))}
  </div>
);

/** Persistent product chrome — one session, guided depth */
export const ProductShell: React.FC<{
  activeNav?: string;
  title?: string;
  subtitle?: string;
  env?: EnvironmentVariant;
  children: React.ReactNode;
  /** When false, use walkthrough-driven header only */
  useWalkthroughHeader?: boolean;
}> = ({
  activeNav,
  title,
  subtitle,
  env = 'neutral',
  children,
  useWalkthroughHeader = true,
}) => {
  const {effectiveFrame} = useCinematicCut();
  const step = getWalkthroughStep(effectiveFrame);
  const nav = activeNav ?? step.nav;
  const displayTitle = useWalkthroughHeader ? step.title : (title ?? step.title);
  const displaySubtitle = useWalkthroughHeader ? step.subtitle : (subtitle ?? step.subtitle);

  return (
    <AbsoluteFill style={{background: CINE.bg, color: GOVAI_TOKENS.textPrimary}}>
      <CinematicEnvironment variant={env} />
      <GovAIAppFrame activeNav={nav} title={displayTitle} subtitle={displaySubtitle} cameraScale={1} cameraY={0}>
        <Breadcrumb parts={step.breadcrumb} />
        <EnterpriseUrgencyStrip />
        {step.actionLabel ? (
          <div
            style={{
              fontFamily: CINE.fontMono,
              fontSize: 11,
              color: CINE.success,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            {step.actionLabel}
          </div>
        ) : null}
        <div style={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 24}}>{children}</div>
      </GovAIAppFrame>
    </AbsoluteFill>
  );
};

import React from 'react';
import {Composition} from 'remotion';
import {GovAIHeroVideo, type GovAIVideoProps} from './compositions/GovAIHeroVideo';
import {
  GovAIDemo,
  GOVAI_DEMO_DURATION_IN_FRAMES,
  govAIDemoFps,
  type GovAIDemoProps,
} from './compositions/GovAIDemo';
import data from './data/govai-release-gate.json';
import demoGovaiOutput from './data/demo_govai_output.json';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="govai-hero-30s"
        component={GovAIHeroVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={data as GovAIVideoProps}
      />
      <Composition
        id="GovAIDemo"
        component={GovAIDemo}
        durationInFrames={GOVAI_DEMO_DURATION_IN_FRAMES}
        fps={govAIDemoFps}
        width={1920}
        height={1080}
        defaultProps={demoGovaiOutput as GovAIDemoProps}
      />
    </>
  );
};
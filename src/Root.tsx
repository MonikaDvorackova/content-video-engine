import React from 'react';
import {Composition} from 'remotion';
import {AIGovHeroVideo, type AIGovVideoProps} from './compositions/AIGovHeroVideo';
import {
  AIGovDemo,
  AIGOV_DEMO_DURATION_IN_FRAMES,
  aigovDemoFps,
  type AIGovDemoProps,
} from './compositions/AIGovDemo';
import data from './data/aigov-release-gate.json';
import demoGovaiOutput from './data/demo_aigov_output.json';
import {
  AIGovSocialVideo,
  SOCIAL_FPS,
} from './compositions/AIGovSocialVideo';
import {defaultRenderBrief} from './creative/fixtures/default-render-brief';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="aigov-hero-30s"
        component={AIGovHeroVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={data as AIGovVideoProps}
      />
      <Composition
        id="AIGovSocialVideo"
        component={AIGovSocialVideo}
        durationInFrames={
          defaultRenderBrief.creative.durationSeconds *
          SOCIAL_FPS
        }
        fps={SOCIAL_FPS}
        width={1080}
        height={1920}
        defaultProps={defaultRenderBrief}
      />
      <Composition
        id="AIGovDemo"
        component={AIGovDemo}
        durationInFrames={AIGOV_DEMO_DURATION_IN_FRAMES}
        fps={aigovDemoFps}
        width={1920}
        height={1080}
        defaultProps={demoGovaiOutput as AIGovDemoProps}
      />
    </>
  );
};
import React from 'react';
import {Composition} from 'remotion';
import {GovAIHeroVideo, type GovAIVideoProps} from './compositions/GovAIHeroVideo';
import data from './data/govai-release-gate.json';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="govai-hero-30s"
      component={GovAIHeroVideo}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={data as GovAIVideoProps}
    />
  );
};
import React from 'react';
import {Composition} from 'remotion';
import {GovAIHeroVideo, type GovAIVideoProps} from './compositions/GovAIHeroVideo';
import {GovAIInvestorDeck, type GovAIInvestorDeckProps} from './compositions/GovAIInvestorDeck';
import {
  GovAIDemo,
  GOVAI_DEMO_DURATION_IN_FRAMES,
  govAIDemoFps,
  type GovAIDemoProps,
} from './compositions/GovAIDemo';
import {
  GovAICinematic,
  CINEMATIC_DURATION_IN_FRAMES,
  CINEMATIC_FPS,
} from './compositions/GovAICinematic';
import data from './data/govai-release-gate.json';
import demoGovaiOutput from './data/demo_govai_output.json';
import './index.css';
import {TOTAL_DECK_DURATION_IN_FRAMES} from './deck/slides';

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
      <Composition
        id="GovAICinematic"
        component={GovAICinematic}
        durationInFrames={CINEMATIC_DURATION_IN_FRAMES}
        fps={CINEMATIC_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="GovAIInvestorDeck"
        component={GovAIInvestorDeck}
        durationInFrames={TOTAL_DECK_DURATION_IN_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{speaker: false, staticExport: false} satisfies GovAIInvestorDeckProps}
      />
      <Composition
        id="GovAIInvestorDeck-Speaker"
        component={GovAIInvestorDeck}
        durationInFrames={TOTAL_DECK_DURATION_IN_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{speaker: true, staticExport: false} satisfies GovAIInvestorDeckProps}
      />
    </>
  );
};
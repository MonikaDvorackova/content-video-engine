import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {GOVAI_TOKENS} from '../GovAIDemo';
import {CinematicAssetGate} from './CinematicAssetGate';
import {CutProvider, useCinematicCut} from './CutContext';
import type {CinematicCut} from './cuts';
import {getCutBeats} from './cuts';
import {prog} from './primitives';
import {ContinuousInfrastructureLayer} from './visual/ContinuousInfrastructure';
import {RuntimeWorldProvider} from './visual/RuntimeWorldContext';
import {ProductCursorLayer} from './visual/ProductInteraction';
import {TypographyOverlay} from './visual/TypographySystem';
import {SCENE_KEYS} from './visual/scenes';
import {CINE} from './visual/tokens';
import {CINEMATIC_FPS, CINEMATIC_SECTIONS, CINEMATIC_VOICEOVER_PATH} from './timing';

export {CINEMATIC_DURATION_IN_FRAMES, CINEMATIC_FPS, CINEMATIC_SECTIONS} from './timing';
export {CUT_CONFIG, getCutDuration, type CinematicCut} from './cuts';

export type GovAICinematicProps = {
  cut?: CinematicCut;
};

const GovAICinematicContent: React.FC = () => {
  const frame = useCurrentFrame();
  const {cut, config} = useCinematicCut();
  const beats = getCutBeats(cut);
  const crossfade = config.crossfade;

  return (
    <AbsoluteFill style={{background: CINE.bg, color: GOVAI_TOKENS.textPrimary}}>
      {config.audio ? (
        <Audio src={staticFile(CINEMATIC_VOICEOVER_PATH)} volume={0.94} />
      ) : null}
      <ContinuousInfrastructureLayer />

      {beats.map((beat, i) => {
        const start = beat.from;
        const end = beat.from + beat.duration;
        if (frame < start - crossfade || frame > end + crossfade) return null;

        const instant = config.instantOpen && i === 0 && frame >= start;
        const fadeIn = instant && frame < start + 4 ? 1 : prog(frame, start, start + crossfade);
        const fadeOut = 1 - prog(frame, end - crossfade, end);
        const opacity = fadeIn * fadeOut;
        const localFrame = frame - start;
        const Scene = SCENE_KEYS[beat.scene];

        return (
          <AbsoluteFill key={`${beat.scene}-${i}-${cut}`} style={{opacity}}>
            <Scene localFrame={localFrame} />
          </AbsoluteFill>
        );
      })}

      <ProductCursorLayer />
      <TypographyOverlay />
    </AbsoluteFill>
  );
};

export const GovAICinematic: React.FC<GovAICinematicProps> = ({cut = 'master'}) => (
  <CinematicAssetGate>
    <CutProvider cut={cut}>
      <RuntimeWorldProvider>
        <GovAICinematicContent />
      </RuntimeWorldProvider>
    </CutProvider>
  </CinematicAssetGate>
);

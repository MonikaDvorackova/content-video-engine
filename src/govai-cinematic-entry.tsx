/**
 * GovAI cinematic renders — master, landing, and hook cuts.
 */
import './index.css';
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {GovAICinematic, CINEMATIC_FPS} from './compositions/GovAICinematic';
import {CUT_CONFIG, getCutDuration, type CinematicCut} from './compositions/GovAICinematic/cuts';

const CUT_IDS: Record<CinematicCut, string> = {
  master: 'GovAICinematic',
  landing: 'GovAICinematic-Landing',
  hook: 'GovAICinematic-Hook',
};

const GovAICinematicRoot: React.FC = () => (
  <>
    {(Object.keys(CUT_CONFIG) as CinematicCut[]).map((cut) => (
      <Composition
        key={cut}
        id={CUT_IDS[cut]}
        component={GovAICinematic}
        durationInFrames={getCutDuration(cut)}
        fps={CINEMATIC_FPS}
        width={1920}
        height={1080}
        defaultProps={{cut}}
      />
    ))}
  </>
);

registerRoot(GovAICinematicRoot);

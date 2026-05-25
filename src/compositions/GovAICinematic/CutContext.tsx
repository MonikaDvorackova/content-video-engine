import React, {createContext, useContext, useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {
  CUT_CONFIG,
  type CinematicCut,
  mapFrameToMaster,
} from './cuts';

type CutContextValue = {
  cut: CinematicCut;
  frame: number;
  effectiveFrame: number;
  config: (typeof CUT_CONFIG)[CinematicCut];
};

const CutContext = createContext<CutContextValue | null>(null);

export const CutProvider: React.FC<{
  cut: CinematicCut;
  children: React.ReactNode;
}> = ({cut, children}) => {
  const frame = useCurrentFrame();
  const value = useMemo(
    () => ({
      cut,
      frame,
      effectiveFrame: mapFrameToMaster(frame, cut),
      config: CUT_CONFIG[cut],
    }),
    [cut, frame],
  );
  return <CutContext.Provider value={value}>{children}</CutContext.Provider>;
};

export const useCinematicCut = (): CutContextValue => {
  const ctx = useContext(CutContext);
  if (!ctx) throw new Error('useCinematicCut requires CutProvider');
  return ctx;
};

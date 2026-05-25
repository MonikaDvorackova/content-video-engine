import React, {createContext, useContext, useMemo} from 'react';
import {useCinematicCut} from '../CutContext';
import {computeWorldState, type WorldState} from '../data/executionWorld';

const RuntimeWorldContext = createContext<WorldState | null>(null);

export const RuntimeWorldProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {effectiveFrame} = useCinematicCut();
  const world = useMemo(() => computeWorldState(effectiveFrame), [effectiveFrame]);
  return (
    <RuntimeWorldContext.Provider value={world}>{children}</RuntimeWorldContext.Provider>
  );
};

export const useRuntimeWorld = (): WorldState => {
  const ctx = useContext(RuntimeWorldContext);
  if (!ctx) {
    throw new Error('useRuntimeWorld must be used within RuntimeWorldProvider');
  }
  return ctx;
};

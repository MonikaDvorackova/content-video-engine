import React from 'react';
import {useCurrentFrame} from 'remotion';
import {RuntimeGraphPanel} from './runtime';
import {useRuntimeWorld} from './RuntimeWorldContext';

/** Canonical topology — world state drives node colors; localFrame adds pulse */
export const PersistentRuntimeGraph: React.FC<{
  height?: number;
  localFrame?: number;
  stepFrames?: number;
  emphasize?: boolean;
}> = ({height = 560, localFrame, stepFrames = 14, emphasize = false}) => {
  const world = useRuntimeWorld();
  const globalFrame = useCurrentFrame();
  const pulseFrame = localFrame ?? globalFrame % 120;

  return (
    <RuntimeGraphPanel
      nodes={world.nodes}
      edges={world.edges}
      localFrame={pulseFrame}
      order={world.traversalOrder}
      stepFrames={stepFrames}
      gateNodes={world.gateNodes}
      chaos={emphasize ? world.chaos : world.chaos * 0.85}
      nodeStates={world.nodeStates}
      height={height}
      showEvidence
    />
  );
};

import React from 'react';
import {SceneOrchestrator} from '../components/GovAIAppFrame';
import {
  MultiAgentAccountabilityScene,
  ToolCallChainScene,
} from '../components/scenes';
import {CinematicShell} from '../primitives';
import {CINEMATIC_SECTIONS} from '../timing';

export const Section5MultiAgent: React.FC = () => {
  const sectionStart = CINEMATIC_SECTIONS.multiAgent.start;

  return (
    <CinematicShell vignette={0.42}>
      <SceneOrchestrator
        sectionStart={sectionStart}
        beats={[
          {
            from: 0,
            duration: 210,
            render: (local) => <MultiAgentAccountabilityScene localFrame={local} />,
          },
          {
            from: 195,
            duration: 120,
            render: (local) => <ToolCallChainScene localFrame={local} />,
          },
          {
            from: 300,
            duration: 120,
            render: (local) => <MultiAgentAccountabilityScene localFrame={local + 120} />,
          },
        ]}
      />
    </CinematicShell>
  );
};

import React from 'react';
import {SceneOrchestrator} from '../components/GovAIAppFrame';
import {
  HumanApprovalScene,
  PolicyGateScene,
  ToolCallChainScene,
} from '../components/scenes';
import {CinematicShell} from '../primitives';
import {CINEMATIC_SECTIONS} from '../timing';

export const Section4RuntimeGovernance: React.FC = () => {
  const sectionStart = CINEMATIC_SECTIONS.runtimeGovernance.start;

  return (
    <CinematicShell vignette={0.4}>
      <SceneOrchestrator
        sectionStart={sectionStart}
        beats={[
          {
            from: 0,
            duration: 150,
            render: (local) => <PolicyGateScene localFrame={local} />,
          },
          {
            from: 135,
            duration: 145,
            render: (local) => <HumanApprovalScene localFrame={local} />,
          },
          {
            from: 270,
            duration: 150,
            render: (local) => <ToolCallChainScene localFrame={local} />,
          },
        ]}
      />
    </CinematicShell>
  );
};

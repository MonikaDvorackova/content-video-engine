import React from 'react';
import {SceneOrchestrator} from '../components/GovAIAppFrame';
import {
  AgentGraphScene,
  GovernanceDashboardScene,
} from '../components/scenes';
import {CinematicShell} from '../primitives';
import {CINEMATIC_SECTIONS} from '../timing';

export const Section1Shift: React.FC = () => {
  const sectionStart = CINEMATIC_SECTIONS.shift.start;

  return (
    <CinematicShell vignette={0.42}>
      <SceneOrchestrator
        sectionStart={sectionStart}
        beats={[
          {
            from: 0,
            duration: 155,
            render: (local) => <GovernanceDashboardScene localFrame={local} />,
          },
          {
            from: 140,
            duration: 170,
            render: (local) => <AgentGraphScene localFrame={local} dense={false} />,
          },
          {
            from: 290,
            duration: 190,
            render: (local) => <AgentGraphScene localFrame={local} dense />,
          },
        ]}
      />
    </CinematicShell>
  );
};

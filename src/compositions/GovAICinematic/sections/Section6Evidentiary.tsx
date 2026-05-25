import React from 'react';
import {SceneOrchestrator} from '../components/GovAIAppFrame';
import {
  AuditVerdictScene,
  EvidenceLedgerScene,
  GovernanceDashboardScene,
} from '../components/scenes';
import {CinematicShell} from '../primitives';
import {CINEMATIC_SECTIONS} from '../timing';

export const Section6Evidentiary: React.FC = () => {
  const sectionStart = CINEMATIC_SECTIONS.evidentiary.start;

  return (
    <CinematicShell vignette={0.35}>
      <SceneOrchestrator
        sectionStart={sectionStart}
        beats={[
          {
            from: 0,
            duration: 145,
            render: (local) => <GovernanceDashboardScene localFrame={local} />,
          },
          {
            from: 130,
            duration: 90,
            render: (local) => <EvidenceLedgerScene localFrame={local + 60} />,
          },
          {
            from: 210,
            duration: 90,
            render: (local) => <AuditVerdictScene localFrame={local} />,
          },
        ]}
      />
    </CinematicShell>
  );
};

import React from 'react';
import {SceneOrchestrator} from '../components/GovAIAppFrame';
import {
  AuditVerdictScene,
  FinalLogoScene,
  InstitutionalInfrastructureScene,
} from '../components/scenes';
import {CinematicShell} from '../primitives';
import {CINEMATIC_SECTIONS} from '../timing';

export const Section7Institutional: React.FC = () => {
  const sectionStart = CINEMATIC_SECTIONS.institutional.start;

  return (
    <CinematicShell vignette={0.48}>
      <SceneOrchestrator
        sectionStart={sectionStart}
        crossfade={22}
        beats={[
          {
            from: 0,
            duration: 175,
            render: (local) => <InstitutionalInfrastructureScene localFrame={local} />,
          },
          {
            from: 160,
            duration: 115,
            render: (local) => <AuditVerdictScene localFrame={local} />,
          },
          {
            from: 265,
            duration: 125,
            render: (local) => <FinalLogoScene localFrame={local} />,
          },
        ]}
      />
    </CinematicShell>
  );
};

import React from 'react';
import {SceneOrchestrator} from '../components/GovAIAppFrame';
import {
  DecisionReplayScene,
  EvidenceLedgerScene,
  GraphOverlay,
} from '../components/scenes';
import {CinematicShell} from '../primitives';
import {CINEMATIC_SECTIONS} from '../timing';

export const Section3Reconstructibility: React.FC = () => {
  const sectionStart = CINEMATIC_SECTIONS.reconstructibility.start;

  return (
    <CinematicShell vignette={0.38}>
      <SceneOrchestrator
        sectionStart={sectionStart}
        beats={[
          {
            from: 0,
            duration: 155,
            render: (local) => <EvidenceLedgerScene localFrame={local} />,
          },
          {
            from: 140,
            duration: 160,
            render: (local) => <DecisionReplayScene localFrame={local} />,
          },
          {
            from: 285,
            duration: 135,
            render: (local) => (
              <div style={{position: 'absolute', inset: 0}}>
                <EvidenceLedgerScene localFrame={local + 80} />
                <GraphOverlay localFrame={local} variant="governed" opacity={0.22} />
              </div>
            ),
          },
        ]}
      />
    </CinematicShell>
  );
};

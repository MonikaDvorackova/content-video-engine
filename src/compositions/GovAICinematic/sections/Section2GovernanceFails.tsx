import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneOrchestrator} from '../components/GovAIAppFrame';
import {
  AuditTraceViewerScene,
  FragmentedTelemetryScene,
} from '../components/scenes';
import {CinematicShell, prog, sectionLocal, StatementHold} from '../primitives';
import {CINEMATIC_SECTIONS} from '../timing';

const STATEMENTS = [
  {text: 'Logs are not evidence.', from: 0.22, to: 0.38},
  {text: 'Observability is not accountability.', from: 0.38, to: 0.55},
  {text: 'Explainability is not reconstructibility.', from: 0.55, to: 0.82},
] as const;

export const Section2GovernanceFails: React.FC = () => {
  const frame = useCurrentFrame();
  const {start, end} = CINEMATIC_SECTIONS.governanceFails;
  const duration = end - start;
  const t = sectionLocal(frame, start, end);

  let activeStatement: (typeof STATEMENTS)[number] | null = null;
  let statementOpacity = 0;
  for (const s of STATEMENTS) {
    const sStart = start + duration * s.from;
    const sEnd = start + duration * s.to;
    const hold = prog(frame, sStart, sStart + 20) * (1 - prog(frame, sEnd - 25, sEnd));
    if (hold > statementOpacity) {
      statementOpacity = hold;
      activeStatement = s;
    }
  }

  const graphDim = 1 - statementOpacity * 0.88;

  return (
    <CinematicShell vignette={0.5}>
      <Section2Visuals graphDim={graphDim} sectionStart={start} t={t} />
      {activeStatement ? (
        <StatementHold opacity={statementOpacity}>{activeStatement.text}</StatementHold>
      ) : null}
    </CinematicShell>
  );
};

const Section2Visuals: React.FC<{
  graphDim: number;
  sectionStart: number;
  t: number;
}> = ({graphDim, sectionStart, t}) => (
  <div style={{opacity: graphDim}}>
    <SceneOrchestrator
      sectionStart={sectionStart}
      beats={[
        {
          from: 0,
          duration: 175,
          render: (local) => <FragmentedTelemetryScene localFrame={local} />,
        },
        {
          from: 160,
          duration: 180,
          render: (local) => <AuditTraceViewerScene localFrame={local} />,
        },
        {
          from: 330,
          duration: 240,
          render: (local) => <FragmentedTelemetryScene localFrame={local + Math.round(t * 30)} />,
        },
      ]}
    />
  </div>
);

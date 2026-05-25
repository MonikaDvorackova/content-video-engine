import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {GOVAI_TOKENS} from '../../GovAIDemo';
import {EVIDENCE_LEDGER, MOCK_RUN} from '../data/mockRun';
import {GOVAI_RECONSTRUCTION_STEPS} from '../data/reconstruction';
import {Chip, Mono} from '../components/ui';
import {RuntimeGraphPanel} from './runtime';
import {useCinematicCut} from '../CutContext';
import {useRuntimeWorld} from './RuntimeWorldContext';
import {CINE} from './tokens';

/** Always-on operational layer — topology, ledger, replay heartbeat */
export const ContinuousInfrastructureLayer: React.FC = () => {
  const world = useRuntimeWorld();
  const {cut} = useCinematicCut();
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 45, [0, 22, 45], [0.35, 1, 0.35]);
  const ghostOpacity = cut === 'master' ? 0.1 : 0.05;

  const lastLedger =
    world.ledgerEntries > 0
      ? EVIDENCE_LEDGER[Math.min(world.ledgerEntries - 1, EVIDENCE_LEDGER.length - 1)]
      : null;

  const replayStep =
    world.replayCursor >= 0
      ? GOVAI_RECONSTRUCTION_STEPS[world.replayCursor]
      : null;

  const hideGhost = world.phase === 'institutional' && frame > 2680;

  return (
    <>
      {!hideGhost ? (
        <div
          style={{
            position: 'absolute',
            right: 36,
            top: 88,
            width: 340,
            height: 148,
            opacity: ghostOpacity + pulse * 0.03,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <RuntimeGraphPanel
            nodes={world.nodes}
            edges={world.edges}
            localFrame={frame}
            order={world.traversalOrder}
            stepFrames={18}
            gateNodes={world.gateNodes}
            chaos={world.chaos * 0.5}
            nodeStates={world.nodeStates}
            height={148}
            showEvidence
          />
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 52,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 240px 0 252px',
          background: 'linear-gradient(0deg, rgba(18,22,30,0.94) 0%, rgba(18,22,30,0.6) 70%, transparent 100%)',
          borderTop: `1px solid ${CINE.border}`,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <Mono color={CINE.text3}>run</Mono>
        <Mono color={CINE.text2}>{world.runId.slice(0, 24)}…</Mono>
        <Chip label={`phase · ${world.phaseLabel}`} tone="muted" />
        <Chip
          label={`ledger · ${world.ledgerEntries}/${world.ledgerTotal}`}
          tone={world.ledgerEntries >= world.ledgerTotal ? 'success' : 'muted'}
        />
        {world.replayCursor >= 0 ? (
          <Chip
            label={`replay · ${world.replayCursor + 1}/${world.replayTotal}`}
            tone="success"
          />
        ) : (
          <Chip label={`propagation · step ${world.propagationStep}`} tone="muted" />
        )}
        {world.activeIntervention ? (
          <Chip label={world.activeIntervention.status} tone={interventionTone(world.activeIntervention.status)} />
        ) : null}
        {world.blockedTool ? <Chip label={`blocked · ${world.blockedTool}`} tone="danger" /> : null}
        {world.rerouteActive ? <Chip label="reroute · human gate" tone="warning" /> : null}
        <div style={{flex: 1}} />
        {lastLedger ? (
          <Mono color={CINE.text3}>
            sync {lastLedger.event} · {lastLedger.hash}
          </Mono>
        ) : null}
        {replayStep ? (
          <Mono color={CINE.success}>
            replay · {replayStep.label}
          </Mono>
        ) : null}
        <Mono color={world.auditVerdict === MOCK_RUN.auditVerdict ? CINE.success : CINE.text3}>
          verdict · {world.auditVerdict}
        </Mono>
      </div>
    </>
  );
};

const interventionTone = (status: string): 'success' | 'warning' | 'danger' | 'muted' => {
  if (status === 'APPROVED') return 'success';
  if (status === 'ESCALATED') return 'warning';
  if (status === 'BLOCKED' || status === 'DENIED') return 'danger';
  return 'muted';
};

import React from 'react';
import {interpolate} from 'remotion';
import {GOVAI_TOKENS} from '../../GovAIDemo';
import {MOCK_RUN} from '../data/mockRun';
import {
  GOVAI_RECONSTRUCTION_STEPS,
  INTERVENTION_BEATS,
  OBSERVABILITY_FRAGMENTS,
} from '../data/reconstruction';
import {activeStep, clamp01} from './motion';
import {CausalChainPanel, TraceExplorerPanel} from './productPanels';
import {RiskScoringUseCase, type RiskStepId} from './riskScoringCase';
import {useRuntimeWorld} from './RuntimeWorldContext';
import {PersistentRuntimeGraph} from './PersistentRuntimeGraph';
import {Chip} from '../components/ui';
import {Mono} from '../components/ui';
import {Panel} from '../components/ui';
import {reveal} from './ui';
import {CINE} from './tokens';

const failJitter = (localFrame: number, i: number) =>
  Math.sin(localFrame / 7 + i * 1.3) * (i % 2 === 0 ? 4 : -3);

/** LEFT: fragmented observability — cannot reconstruct */
export const ObservabilityFailurePanel: React.FC<{localFrame: number}> = ({localFrame}) => {
  const visible = Math.min(
    OBSERVABILITY_FRAGMENTS.length,
    Math.floor(localFrame / 10) + 2,
  );
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <div
        style={{
          fontSize: 11,
          fontFamily: CINE.fontMono,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: CINE.danger,
          marginBottom: 12,
        }}
      >
        Traditional observability
      </div>
      <div style={{fontSize: 20, fontWeight: 700, color: CINE.text, marginBottom: 8, lineHeight: 1.3}}>
        Cannot reconstruct why the AI acted
      </div>
      <div style={{fontSize: 13, color: CINE.text3, marginBottom: 20}}>
        Disconnected logs · partial traces · no governance lineage
      </div>
      <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>
        {OBSERVABILITY_FRAGMENTS.slice(0, visible).map((f, i) => (
          <div
            key={f.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 12px',
              marginBottom: 6,
              background: 'rgba(209,122,122,0.06)',
              border: `1px dashed ${f.status === 'error' ? CINE.danger : 'rgba(139,149,163,0.35)'}`,
              borderRadius: 8,
              opacity: 0.45 + (i % 3) * 0.15,
              transform: `translateX(${failJitter(localFrame, i)}px)`,
            }}
          >
            <span style={{width: 8, height: 8, borderRadius: 99, background: CINE.danger, opacity: 0.5}} />
            <Mono color={CINE.text3}>{f.label}</Mono>
            <div style={{flex: 1}} />
            <Chip label={f.status === 'ok' ? 'status=ok' : f.status.toUpperCase()} tone={f.status === 'ok' ? 'muted' : 'danger'} />
          </div>
        ))}
        {/* Broken graph sketch */}
        <svg width="100%" height="120" style={{marginTop: 16, opacity: 0.5}}>
          {[
            [40, 60, 120, 40],
            [120, 40, 200, 80],
            [200, 80, 280, 30],
          ].map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1}
              y1={y1 + failJitter(localFrame, i + 10)}
              x2={x2}
              y2={y2}
              stroke="rgba(209,122,122,0.4)"
              strokeWidth={1}
              strokeDasharray="4 6"
            />
          ))}
        </svg>
      </div>
      <div
        style={{
          marginTop: 12,
          padding: 14,
          background: 'rgba(209,122,122,0.1)',
          border: `1px solid rgba(209,122,122,0.35)`,
          borderRadius: 8,
          fontFamily: CINE.fontMono,
          fontSize: 13,
          color: CINE.danger,
        }}
      >
        reconstruction: IMPOSSIBLE
      </div>
    </div>
  );
};

/** RIGHT: GovAI step-by-step reconstruction */
export const GovAIReconstructionPanel: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const step = Math.max(activeStep(localFrame, 14), world.replayCursor >= 0 ? world.replayCursor : 0);
  const current = GOVAI_RECONSTRUCTION_STEPS[Math.min(step, GOVAI_RECONSTRUCTION_STEPS.length - 1)];
  const progress = clamp01((localFrame % 14) / 14);

  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <div
        style={{
          fontSize: 11,
          fontFamily: CINE.fontMono,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: CINE.success,
          marginBottom: 12,
        }}
      >
        GovAI reconstructibility
      </div>
      <div style={{fontSize: 20, fontWeight: 700, color: CINE.text, marginBottom: 8}}>
        Decisions reconstructed — step by step
      </div>
      <div style={{fontSize: 13, color: CINE.text3, marginBottom: 16}}>
        {world.delegationChain[0].from} → {world.delegationChain[0].to} · same run
      </div>
      <div style={{flex: 1, position: 'relative'}}>
        <div
          style={{
            position: 'absolute',
            left: 11,
            top: 0,
            bottom: 0,
            width: 2,
            background: CINE.border,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 11,
            top: 0,
            width: 2,
            height: `${((step + progress) / GOVAI_RECONSTRUCTION_STEPS.length) * 100}%`,
            background: CINE.success,
            borderRadius: 2,
          }}
        />
        {GOVAI_RECONSTRUCTION_STEPS.map((s, i) => {
          const lit = i <= step;
          const active = i === step;
          return (
            <div
              key={s.step}
              style={{
                display: 'flex',
                gap: 14,
                paddingLeft: 28,
                marginBottom: 10,
                opacity: reveal(localFrame, i, 5),
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 4,
                  top: 8,
                  width: 12,
                  height: 12,
                  borderRadius: 99,
                  background: lit ? CINE.success : CINE.border,
                  boxShadow: active ? `0 0 14px ${CINE.success}` : undefined,
                }}
              />
              <div style={{flex: 1}}>
                <div style={{fontSize: 14, fontWeight: 600, color: lit ? CINE.text : CINE.text3}}>{s.label}</div>
                <div style={{fontSize: 12, color: CINE.text3, marginTop: 2}}>{s.detail}</div>
                {active ? (
                  <div style={{marginTop: 6, fontFamily: CINE.fontMono, fontSize: 11, color: CINE.success}}>
                    hash: {s.hash}
                  </div>
                ) : null}
              </div>
              {lit ? <Chip label="VERIFIED" tone="success" /> : null}
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', gap: 8, marginTop: 8}}>
        <Chip label="RECONSTRUCTIBLE: true" tone="success" />
        {step >= 7 ? <Chip label={MOCK_RUN.auditVerdict} tone="success" /> : null}
      </div>
    </div>
  );
};

/** Full split-screen hero */
export const ReconstructionSplitLayout: React.FC<{localFrame: number}> = ({localFrame}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
      height: 720,
      background: CINE.border,
    }}
  >
    <div style={{background: '#12161c', padding: 24, borderRight: `1px solid rgba(209,122,122,0.25)`}}>
      <ObservabilityFailurePanel localFrame={localFrame} />
    </div>
    <div style={{background: '#11151b', padding: 24}}>
      <GovAIReconstructionPanel localFrame={localFrame} />
    </div>
  </div>
);

/** Monitoring vs Governance vs Evidence — single idea frame */
export const NotObservabilityLayout: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const phase = Math.floor(localFrame / 50) % 3;
  const lines = [
    {head: 'Monitoring observes.', sub: 'Passive telemetry · fragments · no causality'},
    {head: 'Governance constrains.', sub: 'Runtime policy · intercept · authorize'},
    {head: 'Evidence reconstructs.', sub: 'Deterministic replay · signed lineage'},
  ];
  const active = lines[phase];

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', padding: '0 40px'}}>
      {lines.map((l, i) => (
        <div
          key={l.head}
          style={{
            opacity: i === phase ? 1 : 0.22,
            marginBottom: 28,
            transition: 'opacity 0.2s',
          }}
        >
          <div
            style={{
              fontSize: i === phase ? 42 : 28,
              fontWeight: 600,
              color: i === phase ? CINE.text : CINE.text3,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            {l.head}
          </div>
          {i === phase ? (
            <div style={{fontSize: 17, color: CINE.text2, marginTop: 12}}>{l.sub}</div>
          ) : null}
        </div>
      ))}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 24}}>
        <MiniModeCard title="Observability" mode="passive" active={phase === 0} localFrame={localFrame} />
        <MiniModeCard title="Governance" mode="active" active={phase === 1} localFrame={localFrame} />
        <MiniModeCard title="Reconstructibility" mode="replay" active={phase === 2} localFrame={localFrame} />
      </div>
      <div style={{marginTop: 20, height: 120, opacity: 0.85}}>
        <PersistentRuntimeGraph localFrame={localFrame} height={120} />
      </div>
      <Mono color={CINE.text3}>runtime · {world.runId.slice(0, 22)}… · phase {world.phaseLabel}</Mono>
    </div>
  );
};

const MiniModeCard: React.FC<{
  title: string;
  mode: 'passive' | 'active' | 'replay';
  active: boolean;
  localFrame: number;
}> = ({title, mode, active, localFrame}) => (
  <div
    style={{
      padding: 16,
      background: active ? 'rgba(134,176,146,0.1)' : GOVAI_TOKENS.surfaceChrome,
      border: `1px solid ${active ? CINE.borderBright : CINE.border}`,
      borderRadius: 10,
      minHeight: 100,
    }}
  >
    <div style={{fontSize: 12, fontWeight: 700, color: active ? CINE.text : CINE.text3}}>{title}</div>
    <div style={{marginTop: 12, height: 48, position: 'relative'}}>
      {mode === 'passive' ? (
        <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
          {Array.from({length: 5}, (_, i) => (
            <span
              key={i}
              style={{
                width: 24,
                height: 4,
                background: 'rgba(139,149,163,0.3)',
                borderRadius: 2,
                transform: `translateX(${Math.sin(localFrame / 10 + i) * 6}px)`,
              }}
            />
          ))}
        </div>
      ) : null}
      {mode === 'active' ? (
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 99,
            background: CINE.warning,
            boxShadow: `0 0 12px ${CINE.warning}`,
            marginTop: 8,
          }}
        />
      ) : null}
      {mode === 'replay' ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8}}>
          <div style={{flex: 1, height: 3, background: CINE.border}} />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 99,
              background: CINE.success,
              transform: `translateX(${interpolate(localFrame % 40, [0, 40], [0, 80])}px)`,
            }}
          />
        </div>
      ) : null}
    </div>
  </div>
);

/** Hero trace replay — trace explorer UI */
export const HeroReplayLayout: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const cursor = Math.max(activeStep(localFrame, 16), world.replayCursor >= 0 ? world.replayCursor : 0);
  const step = GOVAI_RECONSTRUCTION_STEPS[Math.min(cursor, GOVAI_RECONSTRUCTION_STEPS.length - 1)];
  const reverseLabel = cursor >= 4;
  const deniedBeat = world.interventionsFired.find((i) => i.status === 'DENIED');

  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: 600}}>
      <TraceExplorerPanel localFrame={localFrame} selectedIndex={cursor} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <Panel title="Selected span · replay inspection">
          <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12}}>
            {reverseLabel ? <Chip label="reverse traversal" tone="warning" /> : null}
            {deniedBeat ? <Chip label={`refs ${deniedBeat.status} · ${deniedBeat.tool ?? deniedBeat.action}`} tone="danger" /> : null}
          </div>
          <div style={{fontSize: 18, fontWeight: 600, color: CINE.text, marginBottom: 8}}>{step.label}</div>
          <Mono color={CINE.text3}>{step.detail}</Mono>
          <div style={{marginTop: 16}}>
            <div style={{fontSize: 12, color: CINE.text3, marginBottom: 8}}>Delegation ancestry</div>
            {[MOCK_RUN.agentId, MOCK_RUN.subAgentId, `human:${MOCK_RUN.humanApprover.split('@')[0]}`].map((a, i) => (
              <div
                key={a}
                style={{
                  padding: '8px 0',
                  opacity: i <= cursor ? 1 : 0.3,
                  borderLeft: i <= cursor ? `2px solid ${CINE.success}` : '2px solid transparent',
                  paddingLeft: 10,
                  fontFamily: CINE.fontMono,
                  fontSize: 12,
                  color: CINE.text2,
                }}
              >
                {a}
              </div>
            ))}
          </div>
        </Panel>
        <div style={{height: 180}}>
          <PersistentRuntimeGraph localFrame={localFrame} height={180} stepFrames={12} />
        </div>
      </div>
      <div style={{gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
        <Panel title="Runtime state recovery">
          <DataRowLite label="policy_verdict" value={MOCK_RUN.policyVerdict} />
          <DataRowLite label="replay_integrity" value="VERIFIED" highlight />
          <DataRowLite label="chain_hash" value={MOCK_RUN.chainHash.slice(0, 28) + '…'} />
        </Panel>
        <Panel title="Final verdict reconstruction">
          <div
            style={{
              fontFamily: CINE.fontMono,
              fontSize: 28,
              color: CINE.success,
              fontWeight: 700,
              opacity: reveal(localFrame, 28, 12),
            }}
          >
            {MOCK_RUN.auditVerdict}
          </div>
          <div style={{marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
            <Chip label="audit_export.json" tone="success" />
            <Chip label="trace_bundle.sealed" tone="success" />
          </div>
        </Panel>
      </div>
    </div>
  );
};

const DataRowLite: React.FC<{label: string; value: string; highlight?: boolean}> = ({
  label,
  value,
  highlight,
}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: GOVAI_TOKENS.fontMono, fontSize: 12}}>
    <span style={{color: GOVAI_TOKENS.textMuted}}>{label}</span>
    <span style={{color: highlight ? CINE.success : GOVAI_TOKENS.textSecondary}}>{value}</span>
  </div>
);

/** Intervention — causal chain + status (why governance changed outcome) */
export const InterventionFocusLayout: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const beat = world.activeIntervention ?? {
    status: 'BLOCKED' as const,
    action: INTERVENTION_BEATS[0].action,
    reason: INTERVENTION_BEATS[0].reason,
    nodes: [] as string[],
    tool: null,
    frame: 0,
  };
  const tone =
    beat.status === 'APPROVED' ? 'success' : beat.status === 'ESCALATED' ? 'warning' : 'danger';

  const riskStep: RiskStepId =
    beat.status === 'APPROVED' ? 'approve' : beat.status === 'ESCALATED' ? 'escalate' : beat.status === 'DENIED' ? 'block' : 'detect';

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: 16}}>
      <RiskScoringUseCase localFrame={localFrame} activeId={riskStep} compact />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 0.85fr', gap: 24, flex: 1, alignItems: 'start'}}>
      <CausalChainPanel localFrame={localFrame} status={beat.status} />
      <div>
        <Panel title="Runtime enforcement">
          <div style={{fontFamily: CINE.fontMono, fontSize: 12, color: CINE.text3, marginBottom: 16}}>{beat.action}</div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              fontFamily: CINE.fontMono,
              color: tone === 'success' ? CINE.success : tone === 'warning' ? CINE.warning : CINE.danger,
              letterSpacing: '0.05em',
              marginBottom: 16,
            }}
          >
            {beat.status}
          </div>
          <div style={{fontSize: 16, color: CINE.text2, lineHeight: 1.45, marginBottom: 20}}>{beat.reason}</div>
          {world.rerouteActive ? <Chip label="execution rerouted → human gate" tone="warning" /> : null}
          {world.blockedTool ? <Chip label={`${world.blockedTool} denied`} tone="danger" /> : null}
        </Panel>
        <div style={{marginTop: 16, height: 200}}>
          <PersistentRuntimeGraph localFrame={localFrame} height={200} emphasize />
        </div>
      </div>
      </div>
    </div>
  );
};

export const PlatformPositioningLayout: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const notItems = [
    'monitoring',
    'observability',
    'compliance theater',
    'static audit logging',
  ];
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '0 80px'}}>
      <div style={{opacity: reveal(localFrame, 2, 10), fontSize: 15, color: CINE.text3, marginBottom: 24}}>
        GovAI is not
      </div>
      {notItems.map((t, i) => (
        <div key={t} style={{opacity: reveal(localFrame, 4 + i, 8), fontSize: 22, color: CINE.text3, marginBottom: 10}}>
          — {t}
        </div>
      ))}
      <div
        style={{
          opacity: reveal(localFrame, 14, 14),
          marginTop: 36,
          fontSize: 32,
          fontWeight: 600,
          color: CINE.text,
          lineHeight: 1.25,
          maxWidth: 800,
        }}
      >
        Runtime governance infrastructure for autonomous systems.
      </div>
      <div style={{opacity: reveal(localFrame, 18, 10), marginTop: 12, fontSize: 15, color: CINE.text2, maxWidth: 640, lineHeight: 1.45}}>
        Of course autonomous systems require this layer — not dashboards, not observability, not compliance theater.
      </div>
      <div style={{opacity: reveal(localFrame, 22, 12), marginTop: 16, fontSize: 16, color: CINE.success, fontFamily: CINE.fontMono}}>
        Once AI systems become autonomous, evidentiary runtime governance becomes inevitable.
      </div>
      <div style={{opacity: reveal(localFrame, 28, 10), marginTop: 20, display: 'flex', gap: 10}}>
        <Chip label={`verdict · ${world.auditVerdict}`} tone="success" />
        <Chip label={`ledger · ${world.ledgerTotal} events`} tone="muted" />
      </div>
    </div>
  );
};

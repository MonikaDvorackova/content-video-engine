import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {institutionalEdges, institutionalNodes} from '../graphData';
import {
  EVIDENCE_LEDGER,
  MOCK_RUN,
  TOOL_CHAIN,
} from '../data/mockRun';
import {
  ApprovalWorkflowPanel,
  AuditExportPanel,
  PolicyEvaluationCard,
  TelemetryTracePanel,
  ToolChainPanel,
} from './productPanels';
import {Panel, Chip, DataRow, Mono, RunMetaBar} from '../components/ui';
import {reveal} from './ui';
import {
  ArchitectureLayer,
  ExplainerLine,
  LogStream,
  MetricStrip,
  SectionBanner,
  activeArchitectureIndex,
} from './educational';
import {
  HeroReplayLayout,
  InterventionFocusLayout,
  NotObservabilityLayout,
  PlatformPositioningLayout,
  ReconstructionSplitLayout,
} from './differentiation';
import {ProductShell} from './ProductShell';
import {PersistentRuntimeGraph} from './PersistentRuntimeGraph';
import {RuntimeGraphPanel} from './runtime';
import {useRuntimeWorld} from './RuntimeWorldContext';
import {
  activeStep,
  countUp,
  typewriter,
  visibleCount,
} from './motion';
import {useCinematicCut} from '../CutContext';
import {RiskScoringUseCase} from './riskScoringCase';
import {CINE} from './tokens';

const TRADITIONAL_LOGS = [
  '[14:32:08] INFO request completed',
  '[14:32:08] DEBUG cache hit ratio=0.91',
  '[14:32:09] WARN latency spike 842ms',
  '[14:32:09] INFO pod restarted',
  '[14:32:10] ERROR 500 upstream',
  '[14:32:10] INFO retry succeeded',
  '[14:32:11] DEBUG no parent span',
  '[14:32:11] WARN orphan log line',
];

const GOVAI_LOGS = [
  '[14:32:08] agent.reason → evidence e3b0…',
  '[14:32:08] policy.evaluate → ALLOW',
  '[14:32:09] delegation.grant → analyst_04',
  '[14:32:09] tool.invoke → risk_scoring',
  '[14:32:11] human.approve → SIGNED',
  '[14:32:11] evidence.commit → SEALED',
];

/* ── SECTION 1: Why AI governance breaks ── */
export const OrchestrationBreakScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const {cut} = useCinematicCut();
  const agents = countUp(localFrame, 12, 847, 20, 80);

  return (
    <ProductShell activeNav="Agents" env="topology">
      <RunMetaBar highlight="run" />
      {cut === 'master' ? (
      <MetricStrip
        localFrame={localFrame}
        items={[
          {label: 'Active agents', value: String(agents)},
          {label: 'Tool invocations / min', value: String(countUp(localFrame, 1200, 3840, 25, 70))},
          {label: 'Human-visible decisions', value: String(countUp(localFrame, 4, 1, 50, 60))},
        ]}
      />
      ) : null}
      <div style={{display: 'grid', gridTemplateColumns: '1.35fr 0.65fr', gap: 24, height: cut === 'master' ? 560 : 620}}>
        <Panel title="Execution topology · governed runtime forming" style={{padding: 0, overflow: 'hidden'}}>
          <PersistentRuntimeGraph localFrame={localFrame} height={540} emphasize />
        </Panel>
        <Panel title="Traditional log stream (no causality)">
          <LogStream lines={TRADITIONAL_LOGS} localFrame={localFrame} />
          <div style={{marginTop: 12, fontSize: 13, color: CINE.warning}}>
            {world.delegationChain[0].from} → {world.delegationChain[0].to} — unattributed
          </div>
        </Panel>
      </div>
    </ProductShell>
  );
};

export const VisibilityLossScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  return (
    <ProductShell
      activeNav="Dashboard"
      title="Humans lose operational visibility"
      subtitle="Same delegation chain — metrics without lineage"
      env="operations"
    >
      <RunMetaBar highlight="phase" />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16}}>
        {['Delegation depth', 'Unattributed tools', 'Missing approvals'].map((label, i) => (
          <div
            key={label}
            style={{
              padding: 16,
              background: '#161B22',
              border: `1px solid ${i === 2 ? 'rgba(209,122,122,0.4)' : CINE.border}`,
              borderRadius: 12,
              opacity: reveal(localFrame, i, 8),
            }}
          >
            <div style={{fontSize: 12, color: CINE.text3}}>{label}</div>
            <div style={{fontSize: 28, fontWeight: 700, color: i === 2 ? CINE.danger : CINE.warning, marginTop: 8}}>
              {i === 0 ? '↑ 14' : i === 1 ? '63%' : '41%'}
            </div>
          </div>
        ))}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, height: 480}}>
        <Panel title="Runtime topology · visibility loss" style={{padding: 0, overflow: 'hidden'}}>
          <PersistentRuntimeGraph localFrame={localFrame} height={440} emphasize />
        </Panel>
        <Panel title="Delegation chain (unresolved)">
          {world.delegationChain.map((d, i) => (
            <div key={d.from} style={{padding: '10px 0', borderBottom: `1px solid ${CINE.border}`, opacity: reveal(localFrame, i, 6)}}>
              <Mono>{d.from} → {d.to}</Mono>
              <div style={{fontSize: 11, color: CINE.text3}}>evidence: {d.evidence} · unresolved</div>
            </div>
          ))}
        </Panel>
      </div>
    </ProductShell>
  );
};

/* ── SECTION 2: AHA — reconstruction split (hero) ── */
export const ReconstructionSplitScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <ProductShell activeNav="Audit" env="audit">
    <RiskScoringUseCase localFrame={localFrame} activeId="request" compact />
    <ReconstructionSplitLayout localFrame={localFrame} />
  </ProductShell>
);

export const GovernanceCompareScene: React.FC<{localFrame: number}> = ReconstructionSplitScene;

/** GovAI is NOT observability — dedicated distinction frame */
export const NotObservabilityScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <ProductShell activeNav="Policies" title=" " subtitle=" " env="neutral">
    <NotObservabilityLayout localFrame={localFrame} />
  </ProductShell>
);

export const TelemetryFailureScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  useRuntimeWorld();
  return (
    <ProductShell env="telemetry">
      <RunMetaBar highlight="run" />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1}}>
        <Panel title="Log stream (disconnected)">
          <LogStream lines={TRADITIONAL_LOGS} localFrame={localFrame} />
        </Panel>
        <TelemetryTracePanel localFrame={localFrame} />
      </div>
      <Panel title="Reconstruction verdict" style={{marginTop: 8, maxWidth: 480}}>
        <Mono color={CINE.danger}>chain_valid: false</Mono>
        <DataRow label="missing_spans" value="3 of 5" />
        <DataRow label="attribution" value="unverifiable" />
      </Panel>
    </ProductShell>
  );
};

export const FailedTraceScene: React.FC<{localFrame: number}> = TelemetryFailureScene;

export const AuditTraceScene: React.FC<{localFrame: number}> = TelemetryFailureScene;

/* ── SECTION 3: What GovAI is ── */
const ARCH_LAYERS = [
  {label: 'Agent orchestration', detail: 'Multi-agent delegation and tool chains'},
  {label: 'Runtime governance layer', detail: 'Policy intercepts inside execution — not after the fact'},
  {label: 'Evidence engine', detail: 'Cryptographic lineage bound to every runtime event'},
  {label: 'Deterministic replay', detail: 'Reconstruct decisions with causal proof'},
  {label: 'Audit & export', detail: 'Institutional verdicts for regulators and legal teams'},
];

export const WhatIsGovaiScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const active = activeArchitectureIndex(localFrame, 20);
  return (
    <ProductShell
      activeNav="Policies"
      title="GovAI is runtime governance infrastructure"
      subtitle="Not a dashboard · Not observability · Governance inside execution"
      env="policy"
    >
      <SectionBanner label="Architecture" title="Evidentiary AI governance stack" localFrame={localFrame} />
      {ARCH_LAYERS.map((layer, i) => (
        <ArchitectureLayer key={layer.label} {...layer} active={i === active} localFrame={localFrame} index={i} />
      ))}
      <div style={{marginTop: 16, display: 'flex', gap: 10}}>
        <Chip label="runtime enforcement" tone="success" />
        <Chip label="signed evidence" tone="success" />
        <Chip label="agent accountability" tone="success" />
      </div>
    </ProductShell>
  );
};

export const RuntimeArchitectureScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <ProductShell activeNav="Agents" title="Governance participates in execution" subtitle="Policy gates attach to the same runtime pathway" env="topology">
    <RunMetaBar highlight="phase" />
    <div style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, height: 640}}>
      <Panel title="Governed execution graph" style={{padding: 0, overflow: 'hidden'}}>
        <PersistentRuntimeGraph localFrame={localFrame} height={600} />
      </Panel>
      <div>
        <ExplainerLine index={0} localFrame={localFrame} text="Actions intercepted before side effects" />
        <ExplainerLine index={1} localFrame={localFrame} text="Audit events generated at runtime" />
        <ExplainerLine index={2} localFrame={localFrame} text="Evidence attached to each span" />
        <ExplainerLine index={3} localFrame={localFrame} text="Delegation authorized with scope bounds" />
      </div>
    </div>
  </ProductShell>
);

/* ── SECTION 4: Runtime governance ── */
export const PolicyGateScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const evalStep = activeStep(localFrame, 16);
  const verdict = world.approved ? 'ALLOW' : evalStep >= 4 ? 'ALLOW' : evalStep >= 2 ? 'WARN' : 'INTERCEPTED';
  return (
    <ProductShell activeNav="Policies" title="Runtime policy gate" subtitle={`${MOCK_RUN.policyId} · same run · post-intervention`} env="policy">
      <RunMetaBar />
      <RiskScoringUseCase localFrame={localFrame} activeId="detect" compact />
      <Chip label="action → policy.evaluate()" tone="warning" />
      {world.blockedTool ? <Chip label={`prior: ${world.blockedTool} DENIED`} tone="danger" /> : null}
      <div style={{display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 24, height: 580}}>
        <PolicyEvaluationCard localFrame={localFrame} evalStep={evalStep} />
        <Panel title="Governed route" style={{padding: 0, overflow: 'hidden'}}>
          <PersistentRuntimeGraph localFrame={localFrame} height={540} />
        </Panel>
      </div>
      <Chip label={`verdict: ${verdict}`} tone={verdict === 'ALLOW' ? 'success' : 'warning'} />
    </ProductShell>
  );
};

export const HumanApprovalScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const approved = world.approved || localFrame >= 55;
  return (
    <ProductShell activeNav="Audit" title="Human approval checkpoint" subtitle={`Unlocks ${MOCK_RUN.toolCalled} after ESCALATED`} env="audit">
      <RunMetaBar highlight="verdict" />
      <RiskScoringUseCase localFrame={localFrame} activeId="approve" compact />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: 480}}>
        <ApprovalWorkflowPanel localFrame={localFrame} approved={approved} />
        <Panel title="Runtime state" style={{padding: 0, overflow: 'hidden'}}>
          <PersistentRuntimeGraph localFrame={localFrame} height={480} />
        </Panel>
      </div>
    </ProductShell>
  );
};

export const ToolChainScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const expanded = activeStep(localFrame, 22);
  return (
    <ProductShell activeNav="Agents" env="topology">
      <RunMetaBar />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 24, height: 560}}>
        <ToolChainPanel localFrame={localFrame} expanded={expanded} />
        <Panel title="Runtime graph" style={{padding: 0, overflow: 'hidden'}}>
          <PersistentRuntimeGraph localFrame={localFrame} height={520} />
        </Panel>
      </div>
    </ProductShell>
  );
};

/* ── SECTION 5: Evidentiary AI ── */
export const EvidenceLedgerScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const visible = Math.max(visibleCount(localFrame, 14, EVIDENCE_LEDGER.length), world.ledgerEntries);
  return (
    <ProductShell activeNav="Evidence" title="Evidence ledger" subtitle="Append-only · same chain from orchestration" env="ledger">
      <RunMetaBar highlight="run" />
      {EVIDENCE_LEDGER.slice(0, visible).map((row, i) => (
        <div
          key={row.seq}
          style={{
            display: 'grid',
            gridTemplateColumns: '48px 1fr 140px 1fr',
            gap: 12,
            padding: '14px 12px',
            marginBottom: 6,
            background: '#161B22',
            border: `1px solid ${CINE.border}`,
            borderRadius: 8,
            opacity: reveal(localFrame, i, 8),
          }}
        >
          <Mono color={CINE.success}>#{row.seq}</Mono>
          <Mono>{row.event}</Mono>
          <Mono color={CINE.text3}>{row.agent}</Mono>
          <Mono>{row.hash}</Mono>
        </div>
      ))}
      <DataRow label="chain_hash" value={typewriter(MOCK_RUN.chainHash.slice(0, 48) + '…', localFrame, 30, 1.5)} />
    </ProductShell>
  );
};

/** Hero replay — central differentiator */
export const HeroReplayScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <ProductShell activeNav="Audit" env="audit">
    <RiskScoringUseCase localFrame={localFrame} activeId="replay" compact />
    <HeroReplayLayout localFrame={localFrame} />
  </ProductShell>
);

export const DecisionReplayScene: React.FC<{localFrame: number}> = HeroReplayScene;

/** Active governance intervention — one status per beat */
export const GovernanceInterventionScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <ProductShell activeNav="Policies" title="Runtime enforcement" subtitle="GovAI intervenes in execution — not passive recording" env="policy">
    <InterventionFocusLayout localFrame={localFrame} />
  </ProductShell>
);

export const MultiAgentAccountabilityScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const lit = activeStep(localFrame, 20);
  return (
    <ProductShell activeNav="Agents" title="Multi-agent accountability" subtitle="Delegation chain resolves on canonical runtime" env="topology">
      <RunMetaBar />
      <div style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, height: 640}}>
        <Panel title="Delegation topology" style={{padding: 0, overflow: 'hidden'}}>
          <PersistentRuntimeGraph localFrame={localFrame} height={600} />
        </Panel>
        <Panel title="Lineage resolution">
          {world.delegationChain.map((d, i) => (
            <div key={d.from} style={{padding: '12px 0', borderBottom: `1px solid ${CINE.border}`, opacity: reveal(localFrame, i, 7), background: i === lit ? 'rgba(134,176,146,0.08)' : undefined}}>
              <Mono>{d.from} → {d.to}</Mono>
              <div style={{fontSize: 12, color: CINE.text3, marginTop: 4}}>scope: {d.scope}</div>
            </div>
          ))}
        </Panel>
      </div>
    </ProductShell>
  );
};

/* ── SECTION 6–7: Scale & close ── */
export const AuditVerdictScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  return (
  <ProductShell activeNav="Audit" title="Audit verdict generation" subtitle="Derived from prior BLOCKED → DENIED → APPROVED chain" env="audit">
    <RunMetaBar highlight="verdict" />
    <RiskScoringUseCase localFrame={localFrame} activeId="export" compact />
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: 460}}>
      <Panel title="Verdict assembly">
        <DataRow label="evidence" value={reveal(localFrame, 10) > 0.5 ? 'complete' : '…'} />
        <DataRow label="policy" value={MOCK_RUN.policyVerdict} />
        <DataRow label="replay" value={reveal(localFrame, 18) > 0.5 ? 'VERIFIED' : '…'} />
        <DataRow label="prior DENIED" value={MOCK_RUN.toolCalled} />
        <DataRow label="human_oversight" value={reveal(localFrame, 24) > 0.5 ? 'SIGNED' : '…'} />
      </Panel>
      <AuditExportPanel localFrame={localFrame} verdict={world.auditVerdict} />
    </div>
  </ProductShell>
  );
};

export const InstitutionalMapScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  const sectors = ['fin', 'health', 'gov', 'ent'];
  const pulse = sectors[Math.min(activeStep(localFrame, 24), sectors.length - 1)];
  return (
    <ProductShell activeNav="Dashboard" title="Institutional scale" subtitle={`Core runtime · ${world.runId.slice(0, 10)}… replicated across sectors`} env="institutional">
      <RunMetaBar highlight="verdict" />
      <MetricStrip
        localFrame={localFrame}
        items={[
          {label: 'Regulated sectors', value: '4'},
          {label: 'Governed pathways', value: String(countUp(localFrame, 120, 2840, 10, 90))},
          {label: 'Active runtimes', value: String(countUp(localFrame, 40, 412, 20, 80))},
        ]}
      />
      <Panel title="Infrastructure topology" style={{padding: 0, overflow: 'hidden'}}>
        <RuntimeGraphPanel
          nodes={institutionalNodes}
          edges={institutionalEdges}
          localFrame={localFrame}
          order={['core', 'fin', 'health', 'gov', 'ent', 'ops']}
          stepFrames={20}
          height={480}
        />
      </Panel>
      <Chip label={`pathway: ${pulse}`} tone="success" />
    </ProductShell>
  );
};

export const FounderCloseScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const world = useRuntimeWorld();
  return (
  <AbsoluteFill style={{background: CINE.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 140px'}}>
    <div style={{position: 'absolute', top: 100, left: 140}}>
      <Mono color={CINE.text3}>
        runtime · {world.runId.slice(0, 18)}… · {world.auditVerdict}
      </Mono>
    </div>
    <div style={{opacity: reveal(localFrame, 2, 8), fontSize: 14, color: CINE.text3, fontFamily: CINE.fontMono}}>
      Built at the intersection of
    </div>
    <div style={{opacity: reveal(localFrame, 4, 8), fontSize: 26, fontWeight: 600, color: CINE.text, marginTop: 16, lineHeight: 1.4}}>
      AI engineering · governance · law
    </div>
    <div style={{opacity: reveal(localFrame, 10, 10), fontSize: 20, color: CINE.text2, marginTop: 28}}>Monika Dvorackova</div>
    <div style={{opacity: reveal(localFrame, 14, 8), fontSize: 15, color: CINE.text3, marginTop: 12}}>
      Research · Institutional AI safety · Evidentiary governance
    </div>
  </AbsoluteFill>
  );
};

export const PlatformCloseScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <AbsoluteFill style={{background: CINE.bg}}>
    <PlatformPositioningLayout localFrame={localFrame} />
  </AbsoluteFill>
);

export const FinalLogoScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const showPlatform = localFrame < 70;
  if (showPlatform) {
    return <PlatformCloseScene localFrame={localFrame} />;
  }
  return (
    <AbsoluteFill style={{background: CINE.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Img src={staticFile('logo.png')} style={{width: 88, height: 88, opacity: reveal(localFrame - 70, 4, 16), marginBottom: 24}} />
      <p style={{margin: 0, fontSize: 44, fontWeight: 600, color: CINE.text, opacity: reveal(localFrame - 70, 10, 12)}}>GovAI</p>
      <p style={{margin: '14px 0 0', fontSize: 18, color: CINE.text2, opacity: reveal(localFrame - 70, 18, 10)}}>Evidentiary AI Governance</p>
    </AbsoluteFill>
  );
};

export type SceneKey = keyof typeof SCENE_KEYS;

export const SCENE_KEYS = {
  orchestrationBreak: OrchestrationBreakScene,
  visibilityLoss: VisibilityLossScene,
  reconstructionSplit: ReconstructionSplitScene,
  governanceCompare: ReconstructionSplitScene,
  telemetryFailure: TelemetryFailureScene,
  failedTrace: TelemetryFailureScene,
  auditTrace: TelemetryFailureScene,
  notObservability: NotObservabilityScene,
  whatIsGovai: WhatIsGovaiScene,
  runtimeArchitecture: RuntimeArchitectureScene,
  governanceIntervention: GovernanceInterventionScene,
  policy: PolicyGateScene,
  approval: HumanApprovalScene,
  toolChain: ToolChainScene,
  ledger: EvidenceLedgerScene,
  heroReplay: HeroReplayScene,
  replay: HeroReplayScene,
  accountability: MultiAgentAccountabilityScene,
  verdict: AuditVerdictScene,
  institutional: InstitutionalMapScene,
  founderClose: FounderCloseScene,
  platformClose: PlatformCloseScene,
  logo: FinalLogoScene,
  emergence: OrchestrationBreakScene,
  opening: OrchestrationBreakScene,
  orchestration: OrchestrationBreakScene,
  multiGraph: VisibilityLossScene,
} as const;

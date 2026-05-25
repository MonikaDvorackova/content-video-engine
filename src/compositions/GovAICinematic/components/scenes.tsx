import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {GOVAI_TOKENS} from '../../GovAIDemo';
import {
  denseOverlapEdges,
  denseOverlapNodes,
  governedEdges,
  governedNodes,
  orchestrationEdges,
  orchestrationNodes,
  singleNode,
  topologyEdges,
  topologyNodes,
  GATE_NODE_IDS,
} from '../graphData';
import {
  DELEGATION_LINEAGE,
  EVIDENCE_LEDGER,
  INSTITUTION_NODES,
  MOCK_RUN,
  POLICY_CHECKS,
  REPLAY_STEPS,
  TOOL_CHAIN,
  TRACE_SPANS,
} from '../data/mockRun';
import {ExecutionGraph, ArchivalLabel} from '../primitives';
import {GovAIAppFrame, revealStagger, useSlowCamera} from './GovAIAppFrame';
import {Chip, DataRow, Mono, Panel, RunMetaBar} from './ui';

/* ── 1. Agent execution graph ── */
export const AgentGraphScene: React.FC<{localFrame: number; dense?: boolean}> = ({
  localFrame,
  dense = false,
}) => {
  const cam = useSlowCamera(localFrame, 180);
  const reveal = interpolate(localFrame, [0, 120], [0.1, dense ? 1.2 : 0.95], {extrapolateRight: 'clamp'});
  const nodes = dense ? denseOverlapNodes : localFrame < 40 ? singleNode : orchestrationNodes;
  const edges = dense ? denseOverlapEdges : localFrame < 40 ? [] : orchestrationEdges;

  return (
    <GovAIAppFrame
      activeNav="Agents"
      title="Agent Execution Graph"
      subtitle="Distributed orchestration topology"
      {...cam}
    >
      <div style={{display: 'flex', gap: 14, height: '100%'}}>
        <Panel title="Execution topology" style={{flex: 1.4, position: 'relative', overflow: 'hidden'}}>
          <ExecutionGraph
            nodes={nodes}
            edges={edges}
            reveal={reveal}
            cameraScale={1.05}
            cameraY={interpolate(localFrame, [0, 180], [20, -30], {extrapolateRight: 'clamp'})}
            chaos={dense ? 0.12 : 0}
          />
          {!dense
            ? ['reason', 'delegate', 'orchestrate', 'coordinate'].map((t, i) => (
                <ArchivalLabel
                  key={t}
                  text={t}
                  x={420 + i * 140}
                  y={680}
                  opacity={revealStagger(localFrame, i + 2, 12)}
                />
              ))
            : null}
        </Panel>
        <Panel title="Active run" style={{flex: 0.7}} badge={<Chip label="LIVE" tone="warning" />}>
          <RunMetaBar highlight="agent" />
          <DataRow label="delegated_by" value={MOCK_RUN.delegatedBy} />
          <DataRow label="tool_called" value={MOCK_RUN.toolCalled} />
          <DataRow label="environment" value={MOCK_RUN.environment} />
          <div style={{marginTop: 16, borderTop: `1px solid ${GOVAI_TOKENS.borderSubtle}`, paddingTop: 12}}>
            <Mono color={GOVAI_TOKENS.textMuted}>execution_depth: {dense ? '14' : '3'}</Mono>
          </div>
        </Panel>
      </div>
    </GovAIAppFrame>
  );
};

/* ── 2. Governance dashboard (opening) ── */
export const GovernanceDashboardScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const cam = useSlowCamera(localFrame, 150);
  return (
    <GovAIAppFrame activeNav="Dashboard" title="Governance Dashboard" subtitle="Runtime oversight" {...cam}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, height: '100%'}}>
        {[
          {label: 'Active runs', val: '247', sub: '+12 today'},
          {label: 'Policy gates', val: '1,842', sub: 'evaluated/hr'},
          {label: 'Evidence commits', val: '9,104', sub: 'append-only'},
        ].map((s, i) => (
          <Panel key={s.label} style={{opacity: revealStagger(localFrame, i)}}>
            <div style={{fontSize: 12, color: GOVAI_TOKENS.textMuted}}>{s.label}</div>
            <MetricValue val={s.val} />
            <div style={{marginTop: 4, fontSize: 11, color: GOVAI_TOKENS.success}}>{s.sub}</div>
          </Panel>
        ))}
      </div>
      <Panel title="Recent agent activity" style={{marginTop: 14, height: 280}}>
        {['agent_orchestrator_01 → delegate', 'agent_analyst_04 → tool.invoke', 'agent_reviewer_02 → policy.check'].map(
          (row, i) => (
            <div
              key={row}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: `1px solid ${GOVAI_TOKENS.borderSubtle}`,
                opacity: revealStagger(localFrame, i + 3, 10),
              }}
            >
              <Mono>{row}</Mono>
              <Chip label="traceable" tone="muted" />
            </div>
          ),
        )}
      </Panel>
    </GovAIAppFrame>
  );
};

const MetricValue: React.FC<{val: string}> = ({val}) => (
  <MetricValueInner val={val} />
);

const MetricValueInner: React.FC<{val: string}> = ({val}) => (
  <div style={{marginTop: 8, fontSize: 36, fontWeight: 600, color: GOVAI_TOKENS.textPrimary}}>{val}</div>
);

const MetricLabel: React.FC<{label: string}> = ({label}) => (
  <div style={{fontSize: 11, color: GOVAI_TOKENS.textMuted, marginBottom: 6}}>{label}</div>
);

/* ── 3. Fragmented telemetry ── */
export const FragmentedTelemetryScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <GovAIAppFrame
    activeNav="Dashboard"
    title="Observability Console"
    subtitle="Insufficient for agentic execution"
    cameraY={Math.sin(localFrame / 30) * 4}
  >
    <div style={{display: 'flex', gap: 14, height: '100%'}}>
      <Panel title="Log stream" style={{flex: 1, transform: `translateX(${Math.sin(localFrame / 20) * 8}px)`}}>
        {Array.from({length: 10}, (_, i) => (
          <div
            key={i}
            style={{
              height: 8,
              width: `${180 + (i * 73) % 400}px`,
              background: 'rgba(196,154,98,0.35)',
              borderRadius: 2,
              marginBottom: 14,
              opacity: 0.3 + (i % 3) * 0.15,
              transform: `translateX(${(i % 2 ? 1 : -1) * Math.sin(localFrame / 15 + i) * 12}px)`,
            }}
          />
        ))}
        <Mono color={GOVAI_TOKENS.warning}>WARN: trace_fragment · span_id missing</Mono>
      </Panel>
      <Panel title="Metrics" style={{flex: 0.8, transform: `translateY(${Math.cos(localFrame / 25) * 6}px)`}}>
        {['latency_p99', 'error_rate', 'throughput', 'queue_depth'].map((m, i) => (
          <div key={m} style={{marginBottom: 16, opacity: revealStagger(localFrame, i, 6)}}>
            <MetricLabel label={m} />
            <div style={{height: 40, background: 'rgba(139,149,163,0.12)', borderRadius: 6, overflow: 'hidden'}}>
              <div
                style={{
                  height: '100%',
                  width: `${30 + (i * 17) % 60}%`,
                  background: 'rgba(196,154,98,0.4)',
                }}
              />
            </div>
          </div>
        ))}
      </Panel>
    </div>
  </GovAIAppFrame>
);

/* ── 4. Audit trace viewer (broken) ── */
export const AuditTraceViewerScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <GovAIAppFrame activeNav="Audit" title="Audit Trace Viewer" subtitle="Incomplete execution chain">
    <Panel title="Distributed trace" badge={<Chip label="PARTIAL" tone="warning" />}>
      <RunMetaBar highlight="run" />
      <div style={{marginTop: 8}}>
        {TRACE_SPANS.map((span, i) => {
          const broken = span.status === 'missing' || span.status === 'partial';
          const opacity = span.status === 'missing' ? 0.25 + Math.sin(localFrame / 10 + i) * 0.15 : 1;
          return (
            <div
              key={span.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 0',
                borderBottom: `1px solid ${GOVAI_TOKENS.borderSubtle}`,
                opacity: revealStagger(localFrame, i, 7) * opacity,
                transform: broken ? `translateX(${Math.sin(localFrame / 12 + i) * 6}px)` : undefined,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 99,
                  background: broken ? 'rgba(196,154,98,0.3)' : 'rgba(134,176,146,0.4)',
                  border: `1px solid ${broken ? GOVAI_TOKENS.warning : GOVAI_TOKENS.success}`,
                }}
              />
              <Mono>{span.label}</Mono>
              <div style={{flex: 1}} />
              <Chip
                label={span.status.toUpperCase()}
                tone={span.status === 'ok' ? 'success' : span.status === 'partial' ? 'warning' : 'danger'}
              />
              <Mono color={GOVAI_TOKENS.textMuted}>{span.duration}</Mono>
            </div>
          );
        })}
      </div>
    </Panel>
  </GovAIAppFrame>
);

/* ── 5. Evidence ledger ── */
export const EvidenceLedgerScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const cam = useSlowCamera(localFrame, 160);
  const visible = Math.min(EVIDENCE_LEDGER.length, Math.floor(localFrame / 18) + 1);
  return (
    <GovAIAppFrame activeNav="Evidence" title="Evidence Ledger" subtitle="Append-only immutable chain" {...cam}>
      <Panel title="Committed evidence" badge={<Chip label="SEALED" tone="success" />}>
        <RunMetaBar />
        <div style={{marginTop: 8}}>
          {EVIDENCE_LEDGER.slice(0, visible).map((row, i) => (
            <div
              key={row.seq}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 140px 180px 1fr 80px',
                gap: 12,
                padding: '10px 0',
                borderBottom: `1px solid ${GOVAI_TOKENS.borderSubtle}`,
                opacity: revealStagger(localFrame, i, 10),
              }}
            >
              <Mono color={GOVAI_TOKENS.success}>#{row.seq}</Mono>
              <Mono>{row.event}</Mono>
              <Mono color={GOVAI_TOKENS.textMuted}>{row.agent}</Mono>
              <Mono>{row.hash}</Mono>
              <Mono color={GOVAI_TOKENS.textMuted}>{row.ts}</Mono>
            </div>
          ))}
        </div>
        <DataRow label="chain_hash" value={MOCK_RUN.chainHash.slice(0, 42) + '…'} />
      </Panel>
    </GovAIAppFrame>
  );
};

/* ── 6. Decision replay ── */
export const DecisionReplayScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <GovAIAppFrame activeNav="Audit" title="Decision Reconstruction" subtitle="Deterministic replay path">
    <div style={{display: 'flex', gap: 14, height: '100%'}}>
      <Panel title="Replay timeline" style={{flex: 1.2}}>
        {REPLAY_STEPS.map((step, i) => {
          const active = localFrame > i * 22;
          return (
            <div key={step.step} style={{display: 'flex', gap: 14, marginBottom: 18, opacity: revealStagger(localFrame, i, 12)}}>
              <div style={{width: 2, background: active ? GOVAI_TOKENS.success : GOVAI_TOKENS.border, minHeight: 48}} />
              <div>
                <div style={{fontSize: 13, color: GOVAI_TOKENS.textPrimary}}>{step.action}</div>
                <Mono color={GOVAI_TOKENS.textMuted}>hash: {step.hash}</Mono>
                {active ? <Chip label="VERIFIED" tone="success" /> : <Chip label="pending" tone="muted" />}
              </div>
            </div>
          );
        })}
      </Panel>
      <Panel title="Verification" style={{flex: 0.7}}>
        <DataRow label="evidence_hash" value={MOCK_RUN.evidenceHash.slice(0, 36) + '…'} />
        <DataRow label="policy_verdict" value={MOCK_RUN.policyVerdict} />
        <DataRow label="replay_status" value="DETERMINISTIC" />
        <div style={{marginTop: 20, padding: 14, border: `1px solid rgba(134,176,146,0.35)`, borderRadius: 10, background: 'rgba(134,176,146,0.08)'}}>
          <Mono color={GOVAI_TOKENS.success}>RECONSTRUCTIBLE: true</Mono>
        </div>
      </Panel>
    </div>
  </GovAIAppFrame>
);

/* ── 7. Policy gate ── */
export const PolicyGateScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <GovAIAppFrame activeNav="Policies" title="Policy Evaluation" subtitle="Runtime governance gate">
    <PolicyLayoutContent localFrame={localFrame} />
  </GovAIAppFrame>
);

const PolicyLayoutContent: React.FC<{localFrame: number}> = ({localFrame}) => (
  <div style={{display: 'flex', gap: 14, height: '100%'}}>
    <Panel title="Policy checks" style={{flex: 0.9}} badge={<Chip label={MOCK_RUN.policyVerdict} tone="success" />}>
      {POLICY_CHECKS.map((c, i) => (
        <div
          key={c.code}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: `1px solid ${GOVAI_TOKENS.borderSubtle}`,
            opacity: revealStagger(localFrame, i, 8),
          }}
        >
          <div>
            <Mono>{c.code}</Mono>
            <PolicyCheckDetail detail={c.detail} />
          </div>
          <Chip label={c.result} tone={c.result === 'PASS' ? 'success' : c.result === 'REQUIRED' ? 'warning' : 'danger'} />
        </div>
      ))}
      <DataRow label="policy_id" value={MOCK_RUN.policyId} />
    </Panel>
    <Panel title="Execution graph + gates" style={{flex: 1.1, position: 'relative', overflow: 'hidden'}}>
      <ExecutionGraph
        nodes={governedNodes}
        edges={governedEdges}
        reveal={0.95}
        align={1}
        showEvidence
        gateNodes={GATE_NODE_IDS}
        cameraScale={1.06}
      />
    </Panel>
  </div>
);

const PolicyCheckDetail: React.FC<{detail: string}> = ({detail}) => (
  <div style={{fontSize: 12, color: GOVAI_TOKENS.textMuted, marginTop: 4}}>{detail}</div>
);

/* ── 8. Human approval checkpoint ── */
export const HumanApprovalScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <GovAIAppFrame activeNav="Audit" title="Human Approval Checkpoint" subtitle="Intervention node in execution graph">
    <Panel title="Approval request" badge={<Chip label="APPROVED" tone="success" />}>
      <RunMetaBar highlight="agent" />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16}}>
        <div>
          <DataRow label="approver" value={MOCK_RUN.humanApprover} />
          <DataRow label="approval_ref" value={MOCK_RUN.approvalRef} />
          <DataRow label="delegated_by" value={MOCK_RUN.delegatedBy} />
          <DataRow label="timestamp" value={MOCK_RUN.timestamp} />
        </div>
        <div
          style={{
            border: `1px solid rgba(134,176,146,0.35)`,
            borderRadius: 12,
            padding: 20,
            background: 'rgba(134,176,146,0.06)',
            opacity: revealStagger(localFrame, 4),
          }}
        >
          <div style={{fontSize: 14, color: GOVAI_TOKENS.textPrimary, marginBottom: 12}}>
            Authorization granted
          </div>
          <Mono color={GOVAI_TOKENS.success}>human.approve → evidence bound</Mono>
          <div style={{marginTop: 14}}>
            <Chip label="SIGNED" tone="success" />
          </div>
        </div>
      </div>
    </Panel>
  </GovAIAppFrame>
);

/* ── 9. Tool call chain ── */
export const ToolCallChainScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <GovAIAppFrame activeNav="Agents" title="Tool Call Chain" subtitle="Constrained execution path">
    <Panel title="Invocation sequence">
      {TOOL_CHAIN.map((t, i) => (
        <div
          key={t.tool}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '14px 0',
            borderBottom: `1px solid ${GOVAI_TOKENS.borderSubtle}`,
            opacity: revealStagger(localFrame, i, 10),
          }}
        >
          <div style={{width: 28, height: 28, borderRadius: 6, border: `1px solid ${GOVAI_TOKENS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Mono>{i + 1}</Mono>
          </div>
          <div style={{flex: 1}}>
            <Mono>{t.tool}</Mono>
            <div style={{fontSize: 11, color: GOVAI_TOKENS.textMuted, marginTop: 4}}>agent: {t.agent}</div>
          </div>
          <Chip label={t.status} tone={t.status === 'complete' ? 'success' : 'warning'} />
          <Mono color={GOVAI_TOKENS.textMuted}>{t.hash}</Mono>
        </div>
      ))}
      <DataRow label="tool_called" value={MOCK_RUN.toolCalled} />
      <DataRow label="evidence_hash" value={MOCK_RUN.evidenceHash.slice(0, 32) + '…'} />
    </Panel>
  </GovAIAppFrame>
);

/* ── 10. Multi-agent accountability ── */
export const MultiAgentAccountabilityScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const cam = useSlowCamera(localFrame, 180);
  return (
    <GovAIAppFrame activeNav="Agents" title="Multi-Agent Accountability" subtitle="Delegation lineage propagation" {...cam}>
      <div style={{display: 'flex', gap: 14, height: '100%'}}>
        <Panel title="Orchestration topology" style={{flex: 1.2, position: 'relative', overflow: 'hidden'}}>
          <ExecutionGraph nodes={topologyNodes} edges={topologyEdges} reveal={0.95} align={1} showEvidence={true} cameraScale={1.08} />
        </Panel>
        <Panel title="Delegation lineage" style={{flex: 0.75}}>
          {DELEGATION_LINEAGE.map((d, i) => (
            <DelegationRow key={d.from} d={d} i={i} localFrame={localFrame} />
          ))}
          <div style={{marginTop: 16}}>
            {['Every action attributable.', 'Every delegation traceable.', 'Every decision reconstructible.'].map(
              (line, i) => (
                <p
                  key={line}
                  style={{
                    margin: '0 0 10px',
                    fontSize: 15,
                    color: GOVAI_TOKENS.textSecondary,
                    opacity: revealStagger(localFrame, i + 5, 14),
                  }}
                >
                  {line}
                </p>
              ),
            )}
          </div>
        </Panel>
      </div>
    </GovAIAppFrame>
  );
};

const DelegationRow: React.FC<{
  d: (typeof DELEGATION_LINEAGE)[number];
  i: number;
  localFrame: number;
}> = ({d, i, localFrame}) => (
  <div style={{padding: '10px 0', borderBottom: `1px solid ${GOVAI_TOKENS.borderSubtle}`, opacity: revealStagger(localFrame, i, 9)}}>
    <Mono>
      {d.from} → {d.to}
    </Mono>
    <div style={{fontSize: 11, color: GOVAI_TOKENS.textMuted, marginTop: 4}}>
      scope: {d.scope} · evidence: {d.evidence}
    </div>
  </div>
);

/* ── 11. Institutional infrastructure ── */
export const InstitutionalInfrastructureScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const nodes = INSTITUTION_NODES.map((n) => ({id: n.id, x: n.x, y: n.y, label: n.label, r: n.id === 'core' ? 14 : 10}));
  const edges = INSTITUTION_NODES.filter((n) => n.id !== 'core').map((n) => ({
    from: 'core',
    to: n.id,
    evidence: true,
  }));
  return (
    <GovAIAppFrame activeNav="Dashboard" title="Institutional Infrastructure" subtitle="Governed autonomous execution at scale">
      <Panel title="Sector orchestration map" style={{position: 'relative', height: '100%', overflow: 'hidden'}}>
        <ExecutionGraph nodes={nodes} edges={edges} reveal={interpolate(localFrame, [0, 100], [0.2, 1], {extrapolateRight: 'clamp'})} align={1} showEvidence={true} cameraScale={1.02} />
      </Panel>
    </GovAIAppFrame>
  );
};

/* ── 12. Audit verdict + final logo ── */
export const AuditVerdictScene: React.FC<{localFrame: number}> = ({localFrame}) => (
  <GovAIAppFrame activeNav="Audit" title="Final Audit Verdict" subtitle="Evidentiary governance complete">
    <Panel>
      <RunMetaBar highlight="verdict" />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 20}}>
        <div>
          <DataRow label="compliance_state" value={MOCK_RUN.complianceState} />
          <DataRow label="audit_verdict" value={MOCK_RUN.auditVerdict} />
          <DataRow label="policy_verdict" value={MOCK_RUN.policyVerdict} />
          <DataRow label="evidence_hash" value={MOCK_RUN.evidenceHash.slice(0, 40) + '…'} />
          <DataRow label="human_approval" value={MOCK_RUN.humanApprover} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid rgba(134,176,146,0.4)`,
            borderRadius: 14,
            background: 'rgba(134,176,146,0.08)',
            opacity: revealStagger(localFrame, 3),
          }}
        >
          <div style={{fontFamily: GOVAI_TOKENS.fontMono, fontSize: 28, color: GOVAI_TOKENS.success}}>
            {MOCK_RUN.auditVerdict}
          </div>
          <div style={{marginTop: 8, fontSize: 13, color: GOVAI_TOKENS.textMuted}}>Chain integrity verified</div>
        </div>
      </div>
      <VerdictChips localFrame={localFrame} />
    </Panel>
  </GovAIAppFrame>
);

const VerdictChips: React.FC<{localFrame: number}> = ({localFrame}) => (
  <div style={{marginTop: 24, display: 'flex', gap: 10, opacity: revealStagger(localFrame, 5)}}>
    <Chip label="EVIDENCE: complete" tone="success" />
    <Chip label={`STATE: ${MOCK_RUN.complianceState}`} tone="success" />
    <Chip label="CHAIN_VALID: true" tone="success" />
  </div>
);

export const FinalLogoScene: React.FC<{localFrame: number}> = ({localFrame}) => {
  const logoOpacity = revealStagger(localFrame, 2, 20);
  const line1 = revealStagger(localFrame, 8, 18);
  const line2 = revealStagger(localFrame, 14, 18);
  const line3 = revealStagger(localFrame, 20, 18);
  const breathe = 0.015 * Math.sin(localFrame / 90);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: GOVAI_TOKENS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 50% 40% at 50% 48%, rgba(134,176,146,${0.04 + breathe}), transparent)`,
        }}
      />
      <Img src={staticFile('logo.png')} style={{width: 88, height: 88, objectFit: 'contain', opacity: logoOpacity * 0.95, marginBottom: 36}} />
      <p style={{margin: 0, fontSize: 48, fontWeight: 500, color: GOVAI_TOKENS.textPrimary, opacity: line1}}>GovAI</p>
      <p style={{margin: '20px 0 0', fontSize: 22, color: GOVAI_TOKENS.textSecondary, opacity: line2}}>
        Evidentiary AI Governance
      </p>
      <p style={{margin: '12px 0 0', fontFamily: GOVAI_TOKENS.fontMono, fontSize: 14, letterSpacing: '0.12em', color: GOVAI_TOKENS.textMuted, opacity: line3, textTransform: 'uppercase'}}>
        Accountability for Agentic Systems
      </p>
    </div>
  );
};

/* ── Graph overlay for section backgrounds ── */
export const GraphOverlay: React.FC<{
  localFrame: number;
  variant: 'orchestration' | 'governed' | 'topology';
  opacity?: number;
}> = ({localFrame, variant, opacity = 0.35}) => {
  const configs = {
    orchestration: {nodes: orchestrationNodes, edges: orchestrationEdges},
    governed: {nodes: governedNodes, edges: governedEdges},
    topology: {nodes: topologyNodes, edges: topologyEdges},
  }[variant];
  return (
    <div style={{position: 'absolute', inset: 0, opacity, pointerEvents: 'none'}}>
      <ExecutionGraph
        nodes={configs.nodes}
        edges={configs.edges}
        reveal={interpolate(localFrame, [0, 80], [0.3, 0.9], {extrapolateRight: 'clamp'})}
        showEvidence={variant !== 'orchestration'}
        align={1}
      />
    </div>
  );
};

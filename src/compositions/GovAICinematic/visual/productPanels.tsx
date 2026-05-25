import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {MOCK_RUN, POLICY_CHECKS, TOOL_CHAIN, TRACE_SPANS} from '../data/mockRun';
import {GOVAI_RECONSTRUCTION_STEPS} from '../data/reconstruction';
import {Chip, DataRow, Mono, Panel} from '../components/ui';
import {reveal} from './ui';
import {CINE} from './tokens';
import {useRuntimeWorld} from './RuntimeWorldContext';

/** Trace explorer — literal product row pattern */
export const TraceExplorerPanel: React.FC<{
  localFrame: number;
  selectedIndex: number;
}> = ({localFrame, selectedIndex}) => {
  const world = useRuntimeWorld();
  const steps = GOVAI_RECONSTRUCTION_STEPS;

  return (
    <Panel
      title="Trace explorer"
      badge={<Chip label="REPLAY" tone="success" />}
      style={{display: 'flex', flexDirection: 'column', minHeight: 0}}
    >
      <div style={{marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <Chip label={`run ${world.runId.slice(4, 14)}…`} tone="muted" />
        <Chip label={`cursor ${selectedIndex + 1}/${steps.length}`} tone="muted" />
      </div>
      <div style={{flex: 1, overflow: 'hidden'}}>
        {steps.map((s, i) => {
          const selected = i === selectedIndex;
          const lit = i <= selectedIndex;
          return (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr auto',
                gap: 12,
                padding: '12px 14px',
                marginBottom: 4,
                borderRadius: 8,
                background: selected ? 'rgba(143,196,154,0.12)' : lit ? CINE.surfaceBright : CINE.surface,
                border: `1px solid ${selected ? CINE.borderBright : CINE.border}`,
                opacity: reveal(localFrame, i, 4),
              }}
            >
              <Mono color={lit ? CINE.success : CINE.text3}>{s.step}</Mono>
              <div>
                <div style={{fontSize: 14, fontWeight: 600, color: lit ? CINE.text : CINE.text3}}>{s.label}</div>
                <Mono color={CINE.text3}>{s.detail}</Mono>
              </div>
              {lit ? <Chip label="VERIFIED" tone="success" /> : <Chip label="pending" tone="muted" />}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export const PolicyEvaluationCard: React.FC<{
  localFrame: number;
  evalStep: number;
}> = ({localFrame, evalStep}) => (
  <Panel title="Policy evaluation">
    {POLICY_CHECKS.map((c, i) => {
      const done = i < evalStep;
      const running = i === evalStep;
      return (
        <div
          key={c.code}
          style={{
            padding: '14px 16px',
            marginBottom: 8,
            borderRadius: 10,
            background: running ? 'rgba(212,168,106,0.1)' : CINE.surfaceBright,
            border: `1px solid ${running ? CINE.warning : CINE.border}`,
            opacity: reveal(localFrame, i, 5),
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{fontFamily: CINE.fontMono, fontSize: 13, fontWeight: 600, color: CINE.text}}>{c.code}</span>
            <Chip label={done ? c.result : running ? 'EVAL…' : 'pending'} tone={done ? 'success' : running ? 'warning' : 'muted'} />
          </div>
          <div style={{fontSize: 12, color: CINE.text3, marginTop: 6}}>{c.detail}</div>
        </div>
      );
    })}
  </Panel>
);

export const ApprovalWorkflowPanel: React.FC<{localFrame: number; approved: boolean}> = ({
  localFrame,
  approved,
}) => (
  <Panel title="Approval workflow">
    <DataRow label="gate" value="HUMAN_REQUIRED" />
    <DataRow label="approver" value={approved ? MOCK_RUN.humanApprover : '—'} />
    <DataRow label="ref" value={approved ? MOCK_RUN.approvalRef : 'pending'} />
    <div
      style={{
        marginTop: 16,
        padding: 20,
        borderRadius: 10,
        background: approved ? 'rgba(143,196,154,0.1)' : 'rgba(212,168,106,0.08)',
        border: `1px solid ${approved ? CINE.borderBright : CINE.border}`,
        opacity: reveal(localFrame, 8, 10),
      }}
    >
      <div style={{fontSize: 16, fontWeight: 600, color: approved ? CINE.success : CINE.warning}}>
        {approved ? 'Signed · execution resumes' : 'Awaiting signature'}
      </div>
    </div>
  </Panel>
);

export const AuditExportPanel: React.FC<{localFrame: number; verdict: string}> = ({
  localFrame,
  verdict,
}) => (
  <Panel title="Audit export">
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      {['audit_export.json', 'trace_bundle.sealed', 'policy_attestation.pdf'].map((f, i) => (
        <div
          key={f}
          style={{
            padding: '14px 16px',
            borderRadius: 8,
            background: CINE.surfaceBright,
            border: `1px solid ${CINE.border}`,
            opacity: reveal(localFrame, i, 6),
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Mono>{f}</Mono>
          <Chip label="ready" tone="success" />
        </div>
      ))}
    </div>
    <div style={{marginTop: 20, fontFamily: CINE.fontMono, fontSize: 26, color: CINE.success, fontWeight: 700}}>
      {verdict}
    </div>
  </Panel>
);

export const CausalChainPanel: React.FC<{
  localFrame: number;
  status: string;
}> = ({localFrame, status}) => {
  const chain = [
    {step: 'detect', label: 'Unsafe delegation detected', detail: 'L2 scope exceeded'},
    {step: 'intercept', label: 'Policy gate intercepts', detail: 'DELEGATION_SCOPE · BLOCK'},
    {step: 'deny', label: 'Tool authorization denied', detail: MOCK_RUN.toolCalled},
    {step: 'reroute', label: 'Execution rerouted', detail: 'human gate required'},
    {step: 'replay', label: 'Replay references event', detail: 'deterministic cursor'},
  ];
  const activeIdx =
    status === 'BLOCKED' ? 1 : status === 'DENIED' ? 2 : status === 'ESCALATED' ? 3 : status === 'APPROVED' ? 4 : 0;

  return (
    <Panel title="Causality chain">
      {chain.map((c, i) => (
        <div
          key={c.step}
          style={{
            display: 'flex',
            gap: 14,
            padding: '12px 0',
            borderLeft: i <= activeIdx ? `3px solid ${CINE.success}` : `3px solid ${CINE.border}`,
            paddingLeft: 14,
            marginBottom: 4,
            opacity: reveal(localFrame, i, 5),
          }}
        >
          <div style={{flex: 1}}>
            <div style={{fontSize: 14, fontWeight: 600, color: i <= activeIdx ? CINE.text : CINE.text3}}>{c.label}</div>
            <Mono color={CINE.text3}>{c.detail}</Mono>
          </div>
          {i === activeIdx ? <Chip label="NOW" tone="warning" /> : i < activeIdx ? <Chip label="✓" tone="success" /> : null}
        </div>
      ))}
    </Panel>
  );
};

export const TelemetryTracePanel: React.FC<{localFrame: number}> = ({localFrame}) => (
  <Panel title="Trace IDs">
    {TRACE_SPANS.map((s, i) => (
      <div
        key={s.id}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: `1px solid ${CINE.border}`,
          opacity: reveal(localFrame, i, 4),
        }}
      >
        <Mono>{s.id}</Mono>
        <Chip label={s.status === 'ok' ? 'linked' : 'BROKEN'} tone={s.status === 'ok' ? 'success' : 'danger'} />
      </div>
    ))}
  </Panel>
);

export const ToolChainPanel: React.FC<{localFrame: number; expanded: number}> = ({localFrame, expanded}) => (
  <Panel title="Tool authorization chain">
    {TOOL_CHAIN.map((t, i) => {
      const open = i <= expanded;
      return (
        <div
          key={t.tool}
          style={{
            padding: '14px 16px',
            marginBottom: 6,
            borderRadius: 8,
            background: open ? CINE.surfaceBright : CINE.surface,
            border: `1px solid ${open ? CINE.borderBright : CINE.border}`,
            opacity: reveal(localFrame, i, 6),
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Mono>{t.tool}</Mono>
            <Chip label={t.status} tone={t.status === 'gated' ? 'warning' : 'success'} />
          </div>
          {open ? <Mono color={CINE.text3}>hash {t.hash}</Mono> : null}
        </div>
      );
    })}
  </Panel>
);

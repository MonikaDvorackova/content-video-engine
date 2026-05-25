import React from 'react';
import {MOCK_RUN} from '../data/mockRun';
import {Chip, Mono} from '../components/ui';
import {reveal} from './ui';
import {CINE} from './tokens';

export const RISK_SCORING_STEPS = [
  {id: 'request', label: 'Agent requests risk_scoring_api', detail: 'External model path'},
  {id: 'detect', label: 'Policy detects unauthorized path', detail: MOCK_RUN.policyId},
  {id: 'block', label: 'Execution blocked', detail: 'TOOL_ACCESS · DENIED'},
  {id: 'escalate', label: 'Escalation triggered', detail: 'Human gate required'},
  {id: 'approve', label: 'Human approval requested', detail: MOCK_RUN.humanApprover},
  {id: 'replay', label: 'Replay reconstructs chain', detail: 'Deterministic cursor'},
  {id: 'export', label: 'Audit export generated', detail: 'audit_export.json'},
] as const;

export type RiskStepId = (typeof RISK_SCORING_STEPS)[number]['id'];

const STEP_ORDER: RiskStepId[] = [
  'request',
  'detect',
  'block',
  'escalate',
  'approve',
  'replay',
  'export',
];

export const activeRiskStep = (activeId: RiskStepId): number =>
  STEP_ORDER.indexOf(activeId);

/** Single operational use case — financial risk scoring */
export const RiskScoringUseCase: React.FC<{
  localFrame: number;
  activeId: RiskStepId;
  compact?: boolean;
}> = ({localFrame, activeId, compact = false}) => {
  const activeIdx = activeRiskStep(activeId);

  return (
    <div
      style={{
        padding: compact ? '12px 16px' : '16px 20px',
        borderRadius: 10,
        background: CINE.surfaceBright,
        border: `1px solid ${CINE.border}`,
        marginBottom: compact ? 12 : 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: compact ? 8 : 12,
        }}
      >
        <span style={{fontSize: 12, fontWeight: 700, color: CINE.text}}>
          Use case · Financial risk scoring
        </span>
        <Chip label="production-east-1" tone="muted" />
      </div>
      {!compact ? (
        <div style={{marginBottom: 12}}>
          <Mono color={CINE.text3}>Operational governance on a live agent run</Mono>
        </div>
      ) : null}
      <div style={{display: 'flex', flexDirection: 'column', gap: compact ? 4 : 6}}>
        {RISK_SCORING_STEPS.map((s, i) => {
          const lit = i <= activeIdx;
          const current = i === activeIdx;
          return (
            <div
              key={s.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '20px 1fr auto',
                gap: 10,
                alignItems: 'center',
                opacity: reveal(localFrame, i, 4) * (lit ? 1 : 0.35),
                padding: compact ? '4px 0' : '6px 0',
                borderLeft: current ? `2px solid ${CINE.success}` : '2px solid transparent',
                paddingLeft: 8,
              }}
            >
              <Mono color={lit ? CINE.success : CINE.text3}>{i + 1}</Mono>
              <div>
                <div style={{fontSize: compact ? 12 : 13, fontWeight: current ? 600 : 400, color: lit ? CINE.text : CINE.text3}}>
                  {s.label}
                </div>
                {!compact ? <Mono color={CINE.text3}>{s.detail}</Mono> : null}
              </div>
              {current ? <Chip label="NOW" tone="warning" /> : lit ? <Chip label="✓" tone="success" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

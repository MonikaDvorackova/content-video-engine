/** Deterministic fixture data for cinematic product mockups */
export const MOCK_RUN = {
  runId: 'run_8f3a2c91-e7b4-4d6a-9c1f-2e8b5d4a7c30',
  agentId: 'agent_orchestrator_01',
  subAgentId: 'agent_analyst_04',
  timestamp: '2026-05-23T14:32:08.412Z',
  delegatedBy: 'agent_orchestrator_01',
  toolCalled: 'risk_scoring_api',
  humanApprover: 'sarah.chen@institution.gov',
  approvalRef: 'APV-2026-0512-0042',
  policyVerdict: 'ALLOW',
  policyId: 'POL-DELEGATION-L2',
  evidenceHash: 'sha256:9f4b2e7c8a1d6f0b3c5e9a7d2f1c8b6a4e3d9c0b7a6f5e4d3c2b1a0f9e8d7c6b',
  chainHash: 'sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
  auditVerdict: 'CHAIN_VALID',
  complianceState: 'VALID',
  environment: 'production-east-1',
} as const;

export const EVIDENCE_LEDGER = [
  {seq: 1, event: 'agent.reason', agent: 'agent_orchestrator_01', hash: 'e3b0c442…9a7d2f', ts: '14:32:08.412'},
  {seq: 2, event: 'policy.evaluate', agent: '—', hash: '7c6a5b4…2f1e0d', ts: '14:32:08.891'},
  {seq: 3, event: 'delegation.grant', agent: 'agent_analyst_04', hash: '4d5e6f7…8a9b0c', ts: '14:32:09.204'},
  {seq: 4, event: 'tool.invoke', agent: 'agent_analyst_04', hash: '1a2b3c4…5d6e7f', ts: '14:32:09.678'},
  {seq: 5, event: 'human.approve', agent: '—', hash: '9f8e7d6…5c4b3a', ts: '14:32:11.002'},
  {seq: 6, event: 'evidence.commit', agent: 'agent_orchestrator_01', hash: 'c0ffee12…deadbeef', ts: '14:32:11.445'},
] as const;

export const TRACE_SPANS = [
  {id: 'span_root', label: 'orchestrate', status: 'ok', duration: '842ms'},
  {id: 'span_reason', label: 'reason', status: 'ok', duration: '312ms'},
  {id: 'span_delegate', label: 'delegate', status: 'partial', duration: '—'},
  {id: 'span_tool', label: 'tool.invoke', status: 'missing', duration: '—'},
  {id: 'span_approve', label: 'human.approve', status: 'missing', duration: '—'},
] as const;

export const POLICY_CHECKS = [
  {code: 'DELEGATION_SCOPE', result: 'PASS', detail: 'L2 delegation within bounds'},
  {code: 'TOOL_ACCESS', result: 'PASS', detail: 'risk_scoring_api authorized'},
  {code: 'DATA_RESIDENCY', result: 'PASS', detail: 'production-east-1 compliant'},
  {code: 'HUMAN_GATE', result: 'REQUIRED', detail: 'Awaiting approval ref'},
] as const;

export const TOOL_CHAIN = [
  {tool: 'fetch_transaction_batch', agent: 'agent_analyst_04', status: 'complete', hash: 'ab12…ef34'},
  {tool: 'risk_scoring_api', agent: 'agent_analyst_04', status: 'complete', hash: 'cd56…gh78'},
  {tool: 'generate_report', agent: 'agent_analyst_04', status: 'gated', hash: 'ij90…kl12'},
] as const;

export const DELEGATION_LINEAGE = [
  {from: 'agent_orchestrator_01', to: 'agent_analyst_04', scope: 'analysis', evidence: '4d5e6f7…'},
  {from: 'agent_analyst_04', to: 'agent_reviewer_02', scope: 'review', evidence: '8a9b0c1…'},
  {from: 'agent_reviewer_02', to: 'human:sarah.chen', scope: 'approval', evidence: '9f8e7d6…'},
] as const;

export const REPLAY_STEPS = [
  {step: 1, action: 'Ingress evidence packet', hash: 'e3b0c442…', verified: true},
  {step: 2, action: 'Policy gate evaluation', hash: '7c6a5b4…', verified: true},
  {step: 3, action: 'Delegation authorization', hash: '4d5e6f7…', verified: true},
  {step: 4, action: 'Tool invocation chain', hash: '1a2b3c4…', verified: true},
  {step: 5, action: 'Human approval checkpoint', hash: '9f8e7d6…', verified: true},
  {step: 6, action: 'Evidence commit + seal', hash: 'c0ffee12…', verified: true},
] as const;

export const INSTITUTION_NODES = [
  {id: 'finance', label: 'Financial Networks', x: 380, y: 320},
  {id: 'health', label: 'Healthcare Orchestration', x: 1540, y: 320},
  {id: 'infra', label: 'Critical Infrastructure', x: 380, y: 760},
  {id: 'gov', label: 'Government Coordination', x: 1540, y: 760},
  {id: 'enterprise', label: 'Enterprise Operations', x: 960, y: 200},
  {id: 'core', label: 'GovAI Runtime', x: 960, y: 540},
] as const;

/** Causal reconstruction chain for hero split-screen & replay */
export const OBSERVABILITY_FRAGMENTS = [
  {id: 'req_8f3a', label: 'request_id=8f3a2c', status: 'ok', linked: false},
  {id: 'log_441', label: 'status=200 OK', status: 'ok', linked: false},
  {id: 'span?', label: 'span_parent=???', status: 'partial', linked: false},
  {id: 'trace_x', label: 'trace_id mismatch', status: 'error', linked: false},
  {id: 'metric', label: 'latency_p99=842ms', status: 'ok', linked: false},
  {id: 'delegate?', label: 'delegate_agent=agent_analyst_04 ???', status: 'missing', linked: false},
  {id: 'tool?', label: 'tool.invoke NOT_FOUND', status: 'missing', linked: false},
  {id: 'approve?', label: 'human.approve missing', status: 'missing', linked: false},
] as const;

export const GOVAI_RECONSTRUCTION_STEPS = [
  {step: 1, phase: 'execution_lineage', label: 'Execution ingress', detail: 'run_id bound · causal root', hash: 'e3b0c442…'},
  {step: 2, phase: 'delegation', label: 'Delegation chain', detail: 'orchestrator → analyst_04', hash: '4d5e6f7…'},
  {step: 3, phase: 'policy', label: 'Policy evaluation', detail: 'DELEGATION_SCOPE · ALLOW', hash: '7c6a5b4…'},
  {step: 4, phase: 'tool', label: 'Tool authorization', detail: 'risk_scoring_api · scoped', hash: '1a2b3c4…'},
  {step: 5, phase: 'approval', label: 'Human approval', detail: 'sarah.chen · SIGNED', hash: '9f8e7d6…'},
  {step: 6, phase: 'evidence', label: 'Evidence attachment', detail: 'hash chain link #6', hash: 'c0ffee12…'},
  {step: 7, phase: 'replay', label: 'Deterministic replay', detail: 'cursor · reverse traversal', hash: '—'},
  {step: 8, phase: 'verdict', label: 'Audit verdict', detail: 'CHAIN_VALID · export ready', hash: 'a1b2c3d…'},
] as const;

/** Scene-local offsets — global frames in executionWorld.GLOBAL_INTERVENTIONS */
export const INTERVENTION_BEATS = [
  {at: 0, action: 'delegation.grant', status: 'BLOCKED', reason: 'scope exceeds L2 bounds'},
  {at: 45, action: 'tool.invoke', status: 'DENIED', reason: 'risk_scoring_api unauthorized'},
  {at: 90, action: 'unsafe_execution', status: 'ESCALATED', reason: 'human gate required'},
  {at: 135, action: 'human.approve', status: 'APPROVED', reason: 'evidence bound · execution resumes'},
] as const;

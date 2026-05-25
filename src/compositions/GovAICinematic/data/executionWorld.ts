import {DELEGATION_LINEAGE, EVIDENCE_LEDGER, MOCK_RUN} from './mockRun';
import {GOVAI_RECONSTRUCTION_STEPS} from './reconstruction';
import {GATE_NODE_IDS, governedEdges, governedNodes} from '../graphData';
import type {NodeState} from '../visual/motion';

/** Single governed runtime — same geometry & identities for the entire film */
export const CANONICAL_TRAVERSAL = [
  'ingress',
  'g1',
  'g2',
  'human',
  'exec',
  'agentA',
  'toolA',
  'agentB',
  'toolB',
  'evidence',
] as const;

export type WorldPhase =
  | 'chaos'
  | 'fragment'
  | 'attach'
  | 'intervene'
  | 'reconstruct'
  | 'institutional';

export const PHASE_LABELS: Record<WorldPhase, string> = {
  chaos: 'orchestration',
  fragment: 'observability gap',
  attach: 'governance attach',
  intervene: 'runtime intervention',
  reconstruct: 'deterministic replay',
  institutional: 'institutional scale',
};

export const GLOBAL_INTERVENTIONS = [
  {
    frame: 1470,
    status: 'BLOCKED' as const,
    action: 'delegation.grant',
    reason: 'scope exceeds L2 bounds',
    nodes: ['g1', 'agentA'],
    tool: null,
  },
  {
    frame: 1515,
    status: 'DENIED' as const,
    action: 'tool.invoke',
    reason: 'risk_scoring_api unauthorized',
    nodes: ['toolA'],
    tool: 'risk_scoring_api',
  },
  {
    frame: 1560,
    status: 'ESCALATED' as const,
    action: 'unsafe_execution',
    reason: 'human gate required',
    nodes: ['g2', 'human'],
    tool: null,
  },
  {
    frame: 1605,
    status: 'APPROVED' as const,
    action: 'human.approve',
    reason: 'evidence bound · execution resumes',
    nodes: ['human', 'g2', 'exec', 'toolA', 'toolB', 'evidence'],
    tool: null,
  },
];

export type WorldState = {
  frame: number;
  phase: WorldPhase;
  phaseLabel: string;
  runId: string;
  ledgerEntries: number;
  ledgerTotal: number;
  replayCursor: number;
  replayTotal: number;
  activeIntervention: (typeof GLOBAL_INTERVENTIONS)[number] | null;
  interventionsFired: (typeof GLOBAL_INTERVENTIONS)[number][];
  approved: boolean;
  blockedTool: string | null;
  rerouteActive: boolean;
  auditVerdict: string;
  chaos: number;
  traversalOrder: string[];
  nodes: typeof governedNodes;
  edges: typeof governedEdges;
  gateNodes: string[];
  nodeStates: Record<string, NodeState>;
  delegationChain: typeof DELEGATION_LINEAGE;
  propagationStep: number;
};

export function getWorldPhase(frame: number): WorldPhase {
  if (frame < 360) return 'chaos';
  if (frame < 1050) return 'fragment';
  if (frame < 1470) return 'attach';
  if (frame < 1890) return 'intervene';
  if (frame < 2310) return 'reconstruct';
  return 'institutional';
}

function getTraversalForPhase(phase: WorldPhase, frame: number): string[] {
  const full = [...CANONICAL_TRAVERSAL];
  if (phase === 'chaos') {
    const n = Math.min(full.length, 4 + Math.floor(frame / 45));
    return full.slice(0, n);
  }
  if (phase === 'fragment') {
    return full.slice(0, 7);
  }
  return full;
}

export function buildWorldNodeStates(frame: number, phase: WorldPhase): Record<string, NodeState> {
  const states: Record<string, NodeState> = {};
  for (const id of CANONICAL_TRAVERSAL) {
    states[id] = 'pending';
  }

  const order = getTraversalForPhase(phase, frame);
  const progress = Math.floor(frame / 22);
  order.forEach((id, i) => {
    if (i < progress - 1) states[id] = 'verified';
    else if (i === progress - 1) states[id] = 'running';
  });

  const fired = GLOBAL_INTERVENTIONS.filter((i) => frame >= i.frame);
  const last = fired[fired.length - 1];
  const approved = fired.some((i) => i.status === 'APPROVED');

  if (last && !approved) {
    for (const id of last.nodes) {
      if (last.status === 'BLOCKED' || last.status === 'DENIED') {
        states[id] = 'failed';
      } else if (last.status === 'ESCALATED') {
        states[id] = 'running';
      }
    }
    if (last.status === 'DENIED') {
      states.toolA = 'failed';
      states.exec = 'running';
    }
    if (last.status === 'BLOCKED') {
      states.agentA = 'failed';
      states.g1 = 'running';
    }
  }

  if (approved) {
    for (const id of CANONICAL_TRAVERSAL) {
      if (order.includes(id)) states[id] = 'verified';
    }
    states.human = 'verified';
    states.evidence = frame >= 2190 ? 'verified' : 'running';
  }

  if (phase === 'fragment') {
    states.toolB = 'failed';
    states.agentB = 'failed';
    if (frame < 600) states.agentA = 'failed';
  }

  if (phase === 'reconstruct' || phase === 'institutional') {
    const replayIdx = Math.min(
      GOVAI_RECONSTRUCTION_STEPS.length - 1,
      Math.floor((frame - 1890) / 38),
    );
    const lit = Math.min(CANONICAL_TRAVERSAL.length - 1, replayIdx);
    CANONICAL_TRAVERSAL.forEach((id, i) => {
      states[id] = i <= lit ? 'verified' : i === lit + 1 ? 'running' : 'pending';
    });
    if (frame >= 1515 && frame < 1605 && !approved) {
      states.toolA = 'failed';
    }
  }

  return states;
}

export function computeWorldState(frame: number): WorldState {
  const phase = getWorldPhase(frame);
  const ledgerStart = 900;
  const ledgerEntries =
    frame >= ledgerStart
      ? Math.min(EVIDENCE_LEDGER.length, 1 + Math.floor((frame - ledgerStart) / 85))
      : 0;

  const replayCursor =
    frame >= 1890
      ? Math.min(GOVAI_RECONSTRUCTION_STEPS.length - 1, Math.floor((frame - 1890) / 38))
      : -1;

  const fired = GLOBAL_INTERVENTIONS.filter((i) => frame >= i.frame);
  const activeIntervention = fired[fired.length - 1] ?? null;
  const approved = fired.some((i) => i.status === 'APPROVED');

  let auditVerdict = '—';
  if (frame >= 2310) auditVerdict = MOCK_RUN.auditVerdict;
  else if (frame >= 2190) auditVerdict = 'ASSEMBLING';
  else if (approved) auditVerdict = 'PENDING_EXPORT';

  const chaos =
    phase === 'chaos' ? 0.045 : phase === 'fragment' ? 0.028 : phase === 'attach' ? 0.012 : 0;

  return {
    frame,
    phase,
    phaseLabel: PHASE_LABELS[phase],
    runId: MOCK_RUN.runId,
    ledgerEntries,
    ledgerTotal: EVIDENCE_LEDGER.length,
    replayCursor,
    replayTotal: GOVAI_RECONSTRUCTION_STEPS.length,
    activeIntervention,
    interventionsFired: fired,
    approved,
    blockedTool:
      frame >= 1515 && frame < 1605 && !approved ? MOCK_RUN.toolCalled : null,
    rerouteActive: frame >= 1560 && frame < 1605,
    auditVerdict,
    chaos,
    traversalOrder: getTraversalForPhase(phase, frame),
    nodes: governedNodes,
    edges: governedEdges,
    gateNodes: GATE_NODE_IDS,
    nodeStates: buildWorldNodeStates(frame, phase),
    delegationChain: DELEGATION_LINEAGE,
    propagationStep: Math.floor(frame / 22),
  };
}

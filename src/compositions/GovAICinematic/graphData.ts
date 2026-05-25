import type {GraphEdge, GraphNode} from './primitives';

export const singleNode: GraphNode[] = [{id: 'exec', x: 960, y: 540, r: 12}];

export const orchestrationNodes: GraphNode[] = [
  {id: 'root', x: 960, y: 280, label: 'orchestrate'},
  {id: 'r1', x: 720, y: 420, label: 'reason'},
  {id: 'r2', x: 1200, y: 420, label: 'delegate'},
  {id: 't1', x: 560, y: 580, label: 'tool'},
  {id: 't2', x: 820, y: 640, label: 'tool'},
  {id: 't3', x: 1100, y: 620, label: 'tool'},
  {id: 'a1', x: 1360, y: 560, label: 'agent'},
  {id: 'a2', x: 680, y: 760, label: 'agent'},
  {id: 'a3', x: 960, y: 820, label: 'coordinate'},
  {id: 'a4', x: 1240, y: 780, label: 'agent'},
  {id: 'x1', x: 480, y: 880},
  {id: 'x2', x: 1440, y: 900},
  {id: 'x3', x: 1040, y: 960},
];

export const orchestrationEdges: GraphEdge[] = [
  {from: 'root', to: 'r1'},
  {from: 'root', to: 'r2'},
  {from: 'r1', to: 't1'},
  {from: 'r1', to: 't2'},
  {from: 'r2', to: 't3'},
  {from: 'r2', to: 'a1'},
  {from: 't1', to: 'a2'},
  {from: 't2', to: 'a3'},
  {from: 't3', to: 'a4'},
  {from: 'a2', to: 'x1'},
  {from: 'a3', to: 'x3'},
  {from: 'a4', to: 'x2'},
  {from: 'a1', to: 'x2'},
  {from: 't1', to: 'a3'},
  {from: 'r1', to: 'a3'},
];

export const denseOverlapNodes: GraphNode[] = [
  ...orchestrationNodes,
  {id: 'o1', x: 400, y: 500},
  {id: 'o2', x: 1520, y: 480},
  {id: 'o3', x: 860, y: 480},
  {id: 'o4', x: 1080, y: 700},
  {id: 'o5', x: 640, y: 920},
  {id: 'o6', x: 1280, y: 940},
];

export const denseOverlapEdges: GraphEdge[] = [
  ...orchestrationEdges,
  {from: 'o1', to: 't1', dashed: true},
  {from: 'o2', to: 'a1', dashed: true},
  {from: 'o3', to: 'root', dashed: true},
  {from: 'o4', to: 'a3', dashed: true},
  {from: 'o5', to: 'x1', dashed: true},
  {from: 'o6', to: 'x2', dashed: true},
  {from: 'o1', to: 'o3', dashed: true},
  {from: 'o2', to: 'o4', dashed: true},
];

export const governedNodes: GraphNode[] = [
  {id: 'ingress', x: 200, y: 540, label: 'ingress'},
  {id: 'g1', x: 420, y: 440, label: 'policy'},
  {id: 'g2', x: 420, y: 640, label: 'approval'},
  {id: 'exec', x: 640, y: 540, label: 'execute'},
  {id: 'agentA', x: 900, y: 380, label: 'agent'},
  {id: 'agentB', x: 900, y: 700, label: 'agent'},
  {id: 'toolA', x: 1160, y: 460, label: 'tool'},
  {id: 'toolB', x: 1160, y: 620, label: 'tool'},
  {id: 'human', x: 720, y: 260, label: 'human'},
  {id: 'evidence', x: 1420, y: 540, label: 'evidence'},
];

export const governedEdges: GraphEdge[] = [
  {from: 'ingress', to: 'g1', evidence: true},
  {from: 'ingress', to: 'g2', evidence: true},
  {from: 'g1', to: 'exec', evidence: true},
  {from: 'g2', to: 'exec', evidence: true},
  {from: 'human', to: 'g2', evidence: true},
  {from: 'exec', to: 'agentA', evidence: true},
  {from: 'exec', to: 'agentB', evidence: true},
  {from: 'agentA', to: 'toolA', evidence: true},
  {from: 'agentB', to: 'toolB', evidence: true},
  {from: 'toolA', to: 'evidence', evidence: true},
  {from: 'toolB', to: 'evidence', evidence: true},
  {from: 'exec', to: 'evidence', evidence: true},
];

export const topologyNodes: GraphNode[] = [
  {id: 'hub', x: 960, y: 540},
  ...Array.from({length: 8}, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r = 280;
    return {
      id: `n${i}`,
      x: 960 + Math.cos(angle) * r,
      y: 540 + Math.sin(angle) * r,
      label: i % 2 === 0 ? 'delegate' : 'agent',
    };
  }),
  ...Array.from({length: 16}, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const r = 420;
    return {
      id: `leaf${i}`,
      x: 960 + Math.cos(angle) * r,
      y: 540 + Math.sin(angle) * r,
    };
  }),
];

export const topologyEdges: GraphEdge[] = [
  ...Array.from({length: 8}, (_, i) => ({
    from: 'hub',
    to: `n${i}`,
    evidence: true,
  })),
  ...Array.from({length: 16}, (_, i) => ({
    from: `n${i % 8}`,
    to: `leaf${i}`,
    evidence: true,
  })),
];

export const institutionalNodes: GraphNode[] = [
  {id: 'core', x: 960, y: 540, r: 14, label: 'governed runtime'},
  {id: 'fin', x: 520, y: 360, label: 'finance'},
  {id: 'health', x: 1400, y: 360, label: 'healthcare'},
  {id: 'infra', x: 520, y: 720, label: 'infrastructure'},
  {id: 'gov', x: 1400, y: 720, label: 'coordination'},
  {id: 'ent', x: 760, y: 200, label: 'enterprise'},
  {id: 'ops', x: 1160, y: 880, label: 'operations'},
];

export const institutionalEdges: GraphEdge[] = [
  {from: 'core', to: 'fin', evidence: true},
  {from: 'core', to: 'health', evidence: true},
  {from: 'core', to: 'infra', evidence: true},
  {from: 'core', to: 'gov', evidence: true},
  {from: 'core', to: 'ent', evidence: true},
  {from: 'core', to: 'ops', evidence: true},
  {from: 'fin', to: 'ent', evidence: true},
  {from: 'health', to: 'gov', evidence: true},
  {from: 'infra', to: 'ops', evidence: true},
];

export const GATE_NODE_IDS = ['g1', 'g2', 'human'];

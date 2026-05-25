import {MOCK_RUN} from './mockRun';

/** Guided investigation — one session, progressive depth */
export type CursorPhase = 'move' | 'hover' | 'click' | 'scrub' | 'select';

export type WalkthroughStep = {
  from: number;
  to: number;
  nav: string;
  breadcrumb: string[];
  title: string;
  subtitle: string;
  cursor: {x: number; y: number; phase: CursorPhase};
  focus?: {x: number; y: number; w: number; h: number; label?: string};
  actionLabel?: string;
};

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    from: 0,
    to: 130,
    nav: 'Dashboard',
    breadcrumb: ['Dashboard', 'Active runs'],
    title: 'Runtime overview',
    subtitle: 'Inspect governed executions in production',
    cursor: {x: 520, y: 320, phase: 'move'},
    focus: {x: 248, y: 200, w: 1180, h: 520, label: 'Execution topology'},
  },
  {
    from: 130,
    to: 360,
    nav: 'Runs',
    breadcrumb: ['Runs', 'run_8f3a2c91', 'Delegation'],
    title: 'Active run inspection',
    subtitle: 'Expand delegation · trace unattributed tools',
    cursor: {x: 680, y: 480, phase: 'hover'},
    focus: {x: 248, y: 280, w: 720, h: 440},
  },
  {
    from: 360,
    to: 640,
    nav: 'Audit',
    breadcrumb: ['Audit', 'Reconstructibility'],
    title: 'Reconstructibility comparison',
    subtitle: 'Observability fragments vs deterministic replay',
    cursor: {x: 1200, y: 400, phase: 'click'},
    focus: {x: 960, y: 220, w: 880, h: 600},
  },
  {
    from: 640,
    to: 1050,
    nav: 'Dashboard',
    breadcrumb: ['Dashboard', 'Telemetry', 'Trace gaps'],
    title: 'Fragmented telemetry',
    subtitle: 'Disconnected spans — cannot reconstruct',
    cursor: {x: 900, y: 360, phase: 'select'},
    focus: {x: 248, y: 240, w: 560, h: 380},
  },
  {
    from: 1050,
    to: 1295,
    nav: 'Policies',
    breadcrumb: ['Policies', 'Runtime governance'],
    title: 'Governance layer',
    subtitle: 'Monitoring observes · governance constrains · evidence reconstructs',
    cursor: {x: 640, y: 520, phase: 'hover'},
  },
  {
    from: 1295,
    to: 1385,
    nav: 'Agents',
    breadcrumb: ['Agents', 'Runtime graph'],
    title: 'Governed execution graph',
    subtitle: 'Policy gates participate in the same pathway',
    cursor: {x: 540, y: 440, phase: 'move'},
    focus: {x: 248, y: 200, w: 900, h: 560},
  },
  {
    from: 1385,
    to: 1470,
    nav: 'Agents',
    breadcrumb: ['Agents', 'Tool chain', MOCK_RUN.toolCalled],
    title: 'Tool authorization chain',
    subtitle: 'Expand scoped invocation before enforcement',
    cursor: {x: 420, y: 380, phase: 'click'},
    focus: {x: 248, y: 240, w: 520, h: 400},
  },
  {
    from: 1470,
    to: 1710,
    nav: 'Policies',
    breadcrumb: ['Policies', 'Intervention', 'tool.invoke'],
    title: 'Runtime enforcement',
    subtitle: 'Policy intercept · denial · escalation',
    cursor: {x: 720, y: 380, phase: 'click'},
    focus: {x: 400, y: 280, w: 640, h: 320, label: 'Policy gate'},
  },
  {
    from: 1710,
    to: 1890,
    nav: 'Audit',
    breadcrumb: ['Audit', 'Approval', MOCK_RUN.approvalRef],
    title: 'Human approval checkpoint',
    subtitle: 'Evidence-bound signature unlocks execution',
    cursor: {x: 580, y: 420, phase: 'click'},
    focus: {x: 248, y: 260, w: 480, h: 280},
  },
  {
    from: 1890,
    to: 2210,
    nav: 'Audit',
    breadcrumb: ['Audit', 'Trace explorer', 'Replay'],
    title: 'Deterministic replay',
    subtitle: 'Reverse traversal · causality reconstruction',
    cursor: {x: 420, y: 520, phase: 'scrub'},
    focus: {x: 248, y: 180, w: 1000, h: 620, label: 'Replay timeline'},
  },
  {
    from: 2210,
    to: 2310,
    nav: 'Evidence',
    breadcrumb: ['Evidence', 'Ledger'],
    title: 'Evidence ledger',
    subtitle: 'Append-only chain from this session',
    cursor: {x: 500, y: 440, phase: 'select'},
    focus: {x: 248, y: 220, w: 1100, h: 500},
  },
  {
    from: 2310,
    to: 2650,
    nav: 'Audit',
    breadcrumb: ['Audit', 'Export', 'Verdict'],
    title: 'Audit export',
    subtitle: 'Verdict derived from prior interventions',
    cursor: {x: 1100, y: 400, phase: 'click'},
    focus: {x: 900, y: 280, w: 480, h: 360, label: 'audit_export.json'},
  },
];

/** Pass master-timeline frame (use effectiveFrame from CutContext) */
export function getWalkthroughStep(masterFrame: number): WalkthroughStep {
  const step =
    [...WALKTHROUGH_STEPS].reverse().find((s) => masterFrame >= s.from && masterFrame < s.to) ??
    WALKTHROUGH_STEPS[WALKTHROUGH_STEPS.length - 1];
  return step;
}

export function interpolateCursor(
  masterFrame: number,
  step: WalkthroughStep,
): {x: number; y: number; phase: CursorPhase} {
  const idx = WALKTHROUGH_STEPS.findIndex((s) => s.from === step.from);
  const prev = idx > 0 ? WALKTHROUGH_STEPS[idx - 1]! : step;
  const t = Math.min(1, (masterFrame - step.from) / 28);
  const x = prev.cursor.x + (step.cursor.x - prev.cursor.x) * t;
  const y = prev.cursor.y + (step.cursor.y - prev.cursor.y) * t;
  const phase =
    masterFrame - step.from < 10
      ? 'move'
      : masterFrame - step.from < 22
        ? 'hover'
        : step.cursor.phase;
  return {x, y, phase};
}

import React from 'react';
import {ExecutionGraph, ArchivalLabel, type GraphEdge, type GraphNode, type NodeState} from '../primitives';
import {activeStep, buildNodeStates} from './motion';
import {CINE} from './tokens';
import {Chip, Mono, reveal, SectionLabel} from './ui';

/** Graph panel — no camera motion; traversal is internal only */
export const RuntimeGraphPanel: React.FC<{
  nodes: GraphNode[];
  edges: GraphEdge[];
  localFrame: number;
  order: string[];
  stepFrames?: number;
  showEvidence?: boolean;
  gateNodes?: string[];
  chaos?: number;
  reveal?: number;
  failFromIndex?: number;
  height?: number;
  nodeStates?: Record<string, NodeState>;
}> = ({
  nodes,
  edges,
  localFrame,
  order,
  stepFrames = 14,
  showEvidence = true,
  gateNodes = [],
  chaos = 0,
  reveal = 1,
  failFromIndex,
  height = 760,
  nodeStates: nodeStatesProp,
}) => {
  const nodeStates =
    nodeStatesProp ?? buildNodeStates(order, localFrame, stepFrames, failFromIndex);
  const pulseEdge = activeStep(localFrame, stepFrames);

  return (
    <div style={{position: 'relative', height, borderRadius: 12, overflow: 'hidden', border: `1px solid ${CINE.border}`}}>
      <ExecutionGraph
        nodes={nodes}
        edges={edges}
        reveal={reveal}
        chaos={chaos}
        align={1}
        cameraScale={1}
        cameraX={0}
        cameraY={0}
        showEvidence={showEvidence}
        gateNodes={gateNodes}
        nodeStates={nodeStates}
        edgeStep={stepFrames}
        pulseEdgeIndex={Math.min(pulseEdge, edges.length - 1)}
        localFrame={localFrame}
      />
    </div>
  );
};

export const ArchivalTypography: React.FC<{
  labels: {text: string; x: number; y: number; at: number}[];
  localFrame: number;
}> = ({labels, localFrame}) => (
  <>
    {labels.map((l) => (
      <ArchivalLabel key={l.text} text={l.text} x={l.x} y={l.y} opacity={reveal(localFrame, l.at, 18)} />
    ))}
  </>
);

export const RuntimeStatusBar: React.FC<{items: {label: string; tone?: 'muted' | 'success' | 'warning' | 'danger'}[]}> = ({
  items,
}) => (
  <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14}}>
    {items.map((item) => (
      <Chip key={item.label} label={item.label} tone={item.tone ?? 'muted'} />
    ))}
  </div>
);

export const LedgerRow: React.FC<{
  seq: number;
  event: string;
  agent: string;
  hash: string;
  ts: string;
  localFrame: number;
  index: number;
  showLink?: boolean;
}> = ({seq, event, agent, hash, ts, localFrame, index, showLink}) => (
  <div style={{position: 'relative', marginBottom: 8}}>
    {showLink ? (
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: -10,
          width: 2,
          height: 10,
          background: CINE.success,
          opacity: reveal(localFrame, index, 10),
        }}
      />
    ) : null}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '50px 160px 200px 1fr 100px',
        gap: 14,
        padding: '16px 12px',
        background: 'rgba(134,176,146,0.06)',
        borderRadius: 10,
        border: `1px solid ${CINE.borderBright}`,
        opacity: reveal(localFrame, index, 10),
      }}
    >
      <Mono color={CINE.success}>#{seq}</Mono>
      <Mono size={16}>{event}</Mono>
      <Mono color={CINE.text3}>{agent}</Mono>
      <Mono>{hash}</Mono>
      <Mono color={CINE.text3}>{ts}</Mono>
    </div>
  </div>
);

export const nodeStateLegend = (localFrame: number, step: number) => (
  <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
    <Chip label="pending" tone="muted" />
    <Chip label="running" tone="warning" />
    <Chip label="verified" tone="success" />
    <Mono color={CINE.text3}>sync step {activeStep(localFrame, step) + 1}</Mono>
  </div>
);

export const propagationLabel = (localFrame: number, stepFrames: number, labels: string[]) => {
  const step = activeStep(localFrame, stepFrames);
  const label = labels[Math.min(step, labels.length - 1)] ?? labels[labels.length - 1];
  return `propagation: ${label}`;
};

export type {NodeState};

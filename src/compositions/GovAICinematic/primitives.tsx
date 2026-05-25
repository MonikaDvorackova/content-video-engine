import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {GOVAI_TOKENS} from '../GovAIDemo';

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const easeCinematic = Easing.bezier(0.25, 0.1, 0.25, 1);

export const prog = (
  frame: number,
  start: number,
  end: number,
  easing: (t: number) => number = easeCinematic,
) =>
  clamp01(
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing,
    }),
  );

export const sectionLocal = (frame: number, start: number, end: number) =>
  clamp01((frame - start) / Math.max(1, end - start));

export const GridBackground: React.FC<{opacity?: number; spacing?: number}> = ({
  opacity = 0.35,
  spacing = 48,
}) => (
  <svg
    width="100%"
    height="100%"
    style={{position: 'absolute', inset: 0, opacity}}
    aria-hidden
  >
    <defs>
      <pattern id="govai-grid" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
        <path
          d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
          fill="none"
          stroke="rgba(139,149,163,0.12)"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#govai-grid)" />
  </svg>
);

export const DepthFog: React.FC<{intensity?: number}> = ({intensity = 1}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `
        radial-gradient(ellipse 70% 55% at 50% 42%, rgba(134,176,146,${0.06 * intensity}), transparent 62%),
        radial-gradient(ellipse 90% 70% at 50% 100%, rgba(0,0,0,${0.55 * intensity}), transparent 55%),
        radial-gradient(ellipse 45% 35% at 12% 18%, rgba(139,149,163,${0.08 * intensity}), transparent 50%)
      `,
      pointerEvents: 'none',
    }}
  />
);

export type GraphNode = {id: string; x: number; y: number; r?: number; label?: string};
export type GraphEdge = {from: string; to: string; dashed?: boolean; evidence?: boolean};
export type NodeState = 'pending' | 'running' | 'verified' | 'failed';

const NODE_STATE_STYLE: Record<NodeState, {fill: string; stroke: string; pulse?: boolean}> = {
  pending: {fill: 'rgba(22,27,34,0.95)', stroke: 'rgba(139,149,163,0.45)'},
  running: {fill: 'rgba(196,154,98,0.22)', stroke: 'rgba(196,154,98,0.65)', pulse: true},
  verified: {fill: 'rgba(134,176,146,0.24)', stroke: 'rgba(134,176,146,0.68)'},
  failed: {fill: 'rgba(209,122,122,0.2)', stroke: 'rgba(209,122,122,0.58)'},
};

export const ExecutionGraph: React.FC<{
  nodes: GraphNode[];
  edges: GraphEdge[];
  reveal?: number;
  chaos?: number;
  align?: number;
  cameraX?: number;
  cameraY?: number;
  cameraScale?: number;
  showEvidence?: boolean;
  gateNodes?: string[];
  nodeStates?: Record<string, NodeState>;
  edgeStep?: number;
  pulseEdgeIndex?: number;
  localFrame?: number;
}> = ({
  nodes,
  edges,
  reveal = 1,
  chaos = 0,
  align = 1,
  cameraX = 0,
  cameraY = 0,
  cameraScale = 1,
  showEvidence = false,
  gateNodes = [],
  nodeStates = {},
  edgeStep,
  pulseEdgeIndex = -1,
  localFrame = 0,
}) => {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const jitter = (id: string, amp: number) => {
    const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return {
      dx: Math.sin(h * 0.7) * amp * chaos,
      dy: Math.cos(h * 1.1) * amp * chaos,
    };
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      style={{position: 'absolute', inset: 0}}
      className="govai-stroke"
    >
      <g
        transform={`translate(${960 + cameraX} ${540 + cameraY}) scale(${cameraScale}) translate(-960 -540)`}
      >
        {edges.map((e, i) => {
          const a = nodeMap[e.from];
          const b = nodeMap[e.to];
          if (!a || !b) return null;
          const ja = jitter(e.from, 28);
          const jb = jitter(e.to, 28);
          const ax = a.x + ja.dx * (1 - align);
          const ay = a.y + ja.dy * (1 - align);
          const bx = b.x + jb.dx * (1 - align);
          const by = b.y + jb.dy * (1 - align);
          const edgeProg = clamp01(reveal * edges.length - i * 0.35);
          const edgeDrawProg =
            edgeStep === undefined ? edgeProg : clamp01((localFrame - i * edgeStep) / 14);
          const len = Math.hypot(bx - ax, by - ay);
          const drawn = edgeStep === undefined ? edgeProg : edgeDrawProg;
          const active = edgeStep === undefined ? drawn > 0.05 : localFrame >= i * edgeStep + 8;
          const isPulseEdge = pulseEdgeIndex === i;
          return (
            <g key={`${e.from}-${e.to}`} opacity={active ? 1 : 0.2}>
              <line
                x1={ax}
                y1={ay}
                x2={ax + (bx - ax) * drawn}
                y2={ay + (by - ay) * drawn}
                stroke={
                  isPulseEdge
                    ? 'rgba(196,154,98,0.85)'
                    : e.evidence && showEvidence
                      ? 'rgba(134,176,146,0.72)'
                      : 'rgba(160,175,195,0.48)'
                }
                strokeWidth={isPulseEdge ? 2.5 : e.evidence && showEvidence ? 2 : 1.5}
                strokeDasharray={e.dashed ? '6 8' : undefined}
                strokeDashoffset={e.dashed ? (1 - drawn) * 40 : 0}
                opacity={drawn * (e.dashed && chaos > 0.3 ? 0.45 + chaos * 0.2 : 1)}
                strokeLinecap="round"
              />
              {showEvidence && e.evidence && drawn > 0.6 ? (
                <circle
                  cx={ax + (bx - ax) * drawn}
                  cy={ay + (by - ay) * drawn}
                  r={3}
                  fill={GOVAI_TOKENS.success}
                  opacity={0.85}
                />
              ) : null}
              {isPulseEdge && drawn > 0.2 ? (
                <circle
                  cx={ax + (bx - ax) * drawn}
                  cy={ay + (by - ay) * drawn}
                  r={5}
                  fill="rgba(196,154,98,0.9)"
                  opacity={0.7 + Math.sin(localFrame / 6) * 0.2}
                />
              ) : null}
            </g>
          );
        })}
        {nodes.map((n, i) => {
          const j = jitter(n.id, 32);
          const nx = n.x + j.dx * (1 - align);
          const ny = n.y + j.dy * (1 - align);
          const nodeProg = clamp01(reveal * nodes.length - i * 0.4);
          const isGate = gateNodes.includes(n.id);
          const r = n.r ?? (isGate ? 14 : 10);
          const state = nodeStates[n.id];
          const style = state ? NODE_STATE_STYLE[state] : null;
          const pulse = style?.pulse ? 1 + Math.sin(localFrame / 8) * 0.12 : 1;
          return (
            <g key={n.id} opacity={nodeProg}>
              {isGate ? (
                <rect
                  x={nx - r - 4}
                  y={ny - r - 4}
                  width={(r + 4) * 2}
                  height={(r + 4) * 2}
                  rx={6}
                  fill="rgba(134,176,146,0.08)"
                  stroke="rgba(134,176,146,0.45)"
                  strokeWidth={1.2}
                />
              ) : null}
              {style?.pulse ? (
                <circle
                  cx={nx}
                  cy={ny}
                  r={r + 6}
                  fill="none"
                  stroke={style.stroke}
                  strokeWidth={1}
                  opacity={0.35 + Math.sin(localFrame / 7) * 0.15}
                />
              ) : null}
              <circle
                cx={nx}
                cy={ny}
                r={r * pulse}
                fill={style?.fill ?? (isGate ? 'rgba(134,176,146,0.22)' : 'rgba(22,27,34,0.95)')}
                stroke={
                  style?.stroke ??
                  (isGate
                    ? 'rgba(134,176,146,0.55)'
                    : showEvidence
                      ? 'rgba(134,176,146,0.4)'
                      : 'rgba(139,149,163,0.45)')
                }
                strokeWidth={1.4}
              />
              <circle cx={nx} cy={ny} r={3} fill={GOVAI_TOKENS.textPrimary} opacity={0.9} />
              {n.label ? (
                <text
                  x={nx}
                  y={ny + r + 18}
                  textAnchor="middle"
                  fill={GOVAI_TOKENS.textMuted}
                  fontSize={11}
                  fontFamily={GOVAI_TOKENS.fontMono}
                  letterSpacing="0.08em"
                >
                  {n.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export const ArchivalLabel: React.FC<{
  text: string;
  x: number;
  y: number;
  opacity: number;
}> = ({text, x, y, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      opacity,
      fontFamily: GOVAI_TOKENS.fontMono,
      fontSize: 13,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: GOVAI_TOKENS.textMuted,
    }}
  >
    {text}
  </div>
);

export const StatementHold: React.FC<{
  children: React.ReactNode;
  opacity: number;
  blur?: number;
}> = ({children, opacity, blur = 0}) => (
  <StatementHoldLayer opacity={opacity} blur={blur}>
    {children}
  </StatementHoldLayer>
);

const StatementHoldLayer: React.FC<{
  children: React.ReactNode;
  opacity: number;
  blur: number;
}> = ({children, opacity, blur}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 120px',
      opacity,
      filter: blur > 0 ? `blur(${blur}px)` : undefined,
    }}
  >
    <p
      style={{
        margin: 0,
        maxWidth: 1200,
        textAlign: 'center',
        fontFamily: GOVAI_TOKENS.fontUi,
        fontSize: 52,
        fontWeight: 500,
        lineHeight: 1.22,
        letterSpacing: '-0.02em',
        color: GOVAI_TOKENS.textPrimary,
      }}
    >
      {children}
    </p>
  </div>
);

export const SectionTypography: React.FC<{
  lines: string[];
  progress: number;
  align?: 'left' | 'center';
  x?: number;
  y?: number;
}> = ({lines, progress, align = 'left', x = 120, y = 820}) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      left: align === 'center' ? 0 : x,
      textAlign: align,
      width: align === 'center' ? '100%' : 640,
      padding: align === 'center' ? '0 120px' : undefined,
    }}
  >
    {lines.map((line, i) => {
      const lineProg = clamp01(progress * lines.length - i * 0.55);
      return (
        <p
          key={line}
          style={{
            margin: '0 0 14px',
            fontFamily: GOVAI_TOKENS.fontUi,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: GOVAI_TOKENS.textSecondary,
            opacity: lineProg,
            transform: `translateY(${(1 - lineProg) * 8}px)`,
          }}
        >
          {line}
        </p>
      );
    })}
  </div>
);

export const CinematicShell: React.FC<{
  children: React.ReactNode;
  vignette?: number;
}> = ({children, vignette = 0.4}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: GOVAI_TOKENS.bg,
      overflow: 'hidden',
    }}
  >
    <GridBackground opacity={0.28} />
    <DepthFog />
    {children}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        boxShadow: `inset 0 0 180px rgba(0,0,0,${vignette})`,
        pointerEvents: 'none',
      }}
    />
  </div>
);

import {interpolate} from 'remotion';

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export type NodeState = 'pending' | 'running' | 'verified' | 'failed';

export const countUp = (
  localFrame: number,
  from: number,
  to: number,
  start = 0,
  duration = 50,
) =>
  Math.round(
    interpolate(localFrame, [start, start + duration], [from, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

export const visibleCount = (localFrame: number, stepFrames: number, max: number) =>
  Math.min(max, Math.floor(localFrame / stepFrames) + 1);

export const activeStep = (localFrame: number, stepFrames: number) =>
  Math.floor(localFrame / stepFrames);

export const isActive = (localFrame: number, at: number) => localFrame >= at;

export const phase = (localFrame: number, start: number, duration: number) =>
  clamp01((localFrame - start) / Math.max(1, duration));

export const buildNodeStates = (
  order: string[],
  localFrame: number,
  stepFrames: number,
  failFromIndex?: number,
): Record<string, NodeState> => {
  const states: Record<string, NodeState> = {};
  for (const id of order) {
    states[id] = 'pending';
  }
  order.forEach((id, i) => {
    const start = i * stepFrames;
    const end = (i + 1) * stepFrames;
    if (failFromIndex !== undefined && i >= failFromIndex) {
      if (localFrame >= start) states[id] = 'failed';
      return;
    }
    if (localFrame >= end) states[id] = 'verified';
    else if (localFrame >= start) states[id] = 'running';
  });
  return states;
};

export const scrollY = (localFrame: number, speed = 1.8, loop = 520) =>
  (localFrame * speed) % loop;

export const typewriter = (text: string, localFrame: number, start: number, charsPerFrame = 0.6) => {
  const n = Math.floor((localFrame - start) * charsPerFrame);
  if (n <= 0) return '';
  if (n >= text.length) return text;
  return text.slice(0, n);
};

export const CINEMATIC_FPS = 30;

const sec = (s: number) => Math.round(s * CINEMATIC_FPS);

/**
 * Section windows tuned to govai-cinematic-voiceover.mp3 (~98s).
 * Proportions preserve hold room for governance-fails statements and outro.
 */
export const CINEMATIC_SECTIONS = {
  shift: {start: sec(0), end: sec(16)},
  governanceFails: {start: sec(16), end: sec(35)},
  reconstructibility: {start: sec(35), end: sec(49)},
  runtimeGovernance: {start: sec(49), end: sec(63)},
  multiAgent: {start: sec(63), end: sec(77)},
  evidentiary: {start: sec(77), end: sec(87)},
  institutional: {start: sec(87), end: sec(100)},
} as const;

/** Master cut length — landing/hook use cuts.ts */
export const CINEMATIC_DURATION_IN_FRAMES = 2700;

export const CINEMATIC_VOICEOVER_PATH = 'audio/govai-cinematic-voiceover.mp3';

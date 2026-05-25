import type {TimelineBeat} from './visual/timeline';
import {CINEMATIC_FPS} from './timing';

export type CinematicCut = 'master' | 'landing' | 'hook';

const sec = (s: number) => Math.round(s * CINEMATIC_FPS);

export type CutBeat = TimelineBeat & {
  /** Master-timeline frame for runtime world / interventions */
  worldAnchor: number;
  worldSpan: number;
};

export type CutConfig = {
  id: CinematicCut;
  label: string;
  durationInFrames: number;
  beats: CutBeat[];
  audio: boolean;
  crossfade: number;
  instantOpen: boolean;
};

/** Full narrative — synced to voiceover (~100s) */
export const MASTER_BEATS: CutBeat[] = [
  {from: 0, duration: 140, scene: 'orchestrationBreak', worldAnchor: 0, worldSpan: 140},
  {from: 120, duration: 110, scene: 'visibilityLoss', worldAnchor: 130, worldSpan: 110},
  {from: 300, duration: 280, scene: 'reconstructionSplit', worldAnchor: 480, worldSpan: 280},
  {from: 560, duration: 100, scene: 'telemetryFailure', worldAnchor: 640, worldSpan: 100},
  {from: 1050, duration: 130, scene: 'notObservability', worldAnchor: 1050, worldSpan: 130},
  {from: 1165, duration: 115, scene: 'whatIsGovai', worldAnchor: 1180, worldSpan: 115},
  {from: 1270, duration: 95, scene: 'runtimeArchitecture', worldAnchor: 1295, worldSpan: 95},
  {from: 1355, duration: 80, scene: 'toolChain', worldAnchor: 1385, worldSpan: 80},
  {from: 1425, duration: 140, scene: 'governanceIntervention', worldAnchor: 1470, worldSpan: 140},
  {from: 1555, duration: 110, scene: 'policy', worldAnchor: 1605, worldSpan: 110},
  {from: 1655, duration: 110, scene: 'approval', worldAnchor: 1710, worldSpan: 110},
  {from: 1755, duration: 320, scene: 'heroReplay', worldAnchor: 1890, worldSpan: 320},
  {from: 2065, duration: 80, scene: 'ledger', worldAnchor: 2210, worldSpan: 80},
  {from: 2135, duration: 120, scene: 'verdict', worldAnchor: 2310, worldSpan: 120},
  {from: 2245, duration: 180, scene: 'institutional', worldAnchor: 2430, worldSpan: 180},
  {from: 2415, duration: 150, scene: 'founderClose', worldAnchor: 2650, worldSpan: 150},
  {from: 2555, duration: 90, scene: 'platformClose', worldAnchor: 2820, worldSpan: 90},
  {from: 2635, duration: 65, scene: 'logo', worldAnchor: 2900, worldSpan: 65},
];

/** 52s — autoplay hero: AHA → intervention → replay → export → close */
export const LANDING_BEATS: CutBeat[] = [
  {from: 0, duration: 360, scene: 'reconstructionSplit', worldAnchor: 480, worldSpan: 300},
  {from: 350, duration: 280, scene: 'governanceIntervention', worldAnchor: 1470, worldSpan: 150},
  {from: 620, duration: 420, scene: 'heroReplay', worldAnchor: 1890, worldSpan: 320},
  {from: 1030, duration: 200, scene: 'verdict', worldAnchor: 2310, worldSpan: 130},
  {from: 1220, duration: 200, scene: 'platformClose', worldAnchor: 2820, worldSpan: 100},
  {from: 1400, duration: 160, scene: 'logo', worldAnchor: 2900, worldSpan: 65},
];

/** 14s — social / investor hook */
export const HOOK_BEATS: CutBeat[] = [
  {from: 0, duration: 95, scene: 'governanceIntervention', worldAnchor: 1515, worldSpan: 90},
  {from: 88, duration: 155, scene: 'heroReplay', worldAnchor: 1950, worldSpan: 150},
  {from: 235, duration: 85, scene: 'runtimeArchitecture', worldAnchor: 1320, worldSpan: 85},
  {from: 312, duration: 55, scene: 'verdict', worldAnchor: 2340, worldSpan: 55},
  {from: 360, duration: 60, scene: 'platformClose', worldAnchor: 2850, worldSpan: 60},
];

export const CUT_CONFIG: Record<CinematicCut, CutConfig> = {
  master: {
    id: 'master',
    label: 'Master',
    durationInFrames: 2700,
    beats: MASTER_BEATS,
    audio: true,
    crossfade: 8,
    instantOpen: false,
  },
  landing: {
    id: 'landing',
    label: 'Landing',
    durationInFrames: sec(52),
    beats: LANDING_BEATS,
    audio: false,
    crossfade: 6,
    instantOpen: true,
  },
  hook: {
    id: 'hook',
    label: 'Hook',
    durationInFrames: sec(14),
    beats: HOOK_BEATS,
    audio: false,
    crossfade: 5,
    instantOpen: true,
  },
};

export function getCutBeats(cut: CinematicCut): CutBeat[] {
  return CUT_CONFIG[cut].beats;
}

/** Map cut-local frame → master timeline for world / walkthrough */
export function mapFrameToMaster(frame: number, cut: CinematicCut): number {
  if (cut === 'master') return frame;
  const beats = getCutBeats(cut);
  for (const beat of beats) {
    const end = beat.from + beat.duration;
    if (frame >= beat.from && frame < end) {
      const t = (frame - beat.from) / Math.max(1, beat.duration);
      return Math.round(beat.worldAnchor + t * beat.worldSpan);
    }
  }
  const last = beats[beats.length - 1]!;
  return last.worldAnchor + last.worldSpan;
}

export function getCutDuration(cut: CinematicCut): number {
  return CUT_CONFIG[cut].durationInFrames;
}

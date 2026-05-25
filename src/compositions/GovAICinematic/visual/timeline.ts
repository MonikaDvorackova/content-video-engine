import type {SceneKey} from './scenes';
import {MASTER_BEATS} from '../cuts';

export type TimelineBeat = {
  from: number;
  duration: number;
  scene: SceneKey;
};

/** @deprecated Use cuts.ts MASTER_BEATS — kept for imports */
export const CINEMATIC_BEATS: TimelineBeat[] = MASTER_BEATS;

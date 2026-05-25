/** Apple-style graphite — lifted luminance floor, no dead black */
export const CINE = {
  bg: '#12161e',
  bgDeep: '#0f1319',
  surface: '#1a212b',
  surfaceBright: '#222a36',
  surfaceElevated: '#283242',
  surfaceGlass: 'rgba(34, 42, 54, 0.92)',
  border: 'rgba(155, 168, 184, 0.38)',
  borderBright: 'rgba(134, 176, 146, 0.55)',
  text: '#f4f3f0',
  text2: '#c8d0da',
  text3: '#9aa6b5',
  success: '#8fc49a',
  successBright: '#a8ddb2',
  warning: '#d4a86a',
  danger: '#e08a8a',
  accent: '#8fc49a',
  grid: 'rgba(155, 168, 184, 0.14)',
  gridBright: 'rgba(134, 176, 146, 0.22)',
  scrim: 'rgba(18, 22, 30, 0.88)',
  fontUi:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontMono:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  radius: 12,
  shadow: '0 12px 32px rgba(0,0,0,0.28)',
  safeBottom: 920,
  safeSide: 72,
} as const;

export type EnvironmentVariant =
  | 'operations'
  | 'topology'
  | 'telemetry'
  | 'audit'
  | 'ledger'
  | 'policy'
  | 'institutional'
  | 'neutral';

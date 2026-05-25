export const GOVAI_DECK = {
  bg: '#0B0E13',
  surface0: 'rgba(17, 21, 27, 0.72)',
  surface1: 'rgba(22, 27, 34, 0.72)',
  border: 'rgba(139, 149, 163, 0.28)',
  borderSubtle: 'rgba(139, 149, 163, 0.14)',
  text: '#F6F5F2',
  text2: 'rgba(185, 194, 204, 0.92)',
  text3: 'rgba(139, 149, 163, 0.92)',
  success: '#86B092',
  warning: '#C49A62',
  danger: '#D17A7A',
  shadow: '0 10px 28px rgba(0,0,0,0.35)',
  radius: 14,
  mono:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  ui:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const;

export type AllowDeny = 'allow' | 'deny' | 'neutral';


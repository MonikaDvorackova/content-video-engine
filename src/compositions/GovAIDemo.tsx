import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export const GOVAI_TOKENS = {
  bg: '#0B0E13',
  surfaceChrome: '#11151B',
  surfaceMid: '#161B22',
  textPrimary: '#f6f5f2',
  textSecondary: '#b9c2cc',
  textMuted: '#8b95a3',
  success: '#86b092',
  warning: '#c49a62',
  border: 'rgba(139, 149, 163, 0.28)',
  borderSubtle: 'rgba(139, 149, 163, 0.14)',
  shadow: '0 10px 28px rgba(0,0,0,0.35)',
  radiusCard: 12,
  fontUi:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontMono:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const;

export const GOVAI_DEMO_FPS = 30;
export const GOVAI_DEMO_DURATION_IN_FRAMES = 90 * GOVAI_DEMO_FPS;
export const govAIDemoFps = GOVAI_DEMO_FPS;

const GOVAI_DEMO_AUDIO_BED_PATH = 'audio/govai-demo-bed.mp3';
const GOVAI_DEMO_AUDIO_VOICEOVER_PATH = 'audio/govai-demo-voiceover.mp3';
const ENABLE_BED_AUDIO = false;
const ENABLE_VOICEOVER = true;

const sec = (s: number) => Math.round(s * GOVAI_DEMO_FPS);
const T = {
  opening: {start: sec(0), end: sec(8)},
  problem: {start: sec(8), end: sec(16)},
  lifecycle: {start: sec(16), end: sec(68)},
  compliance: {start: sec(68), end: sec(76)},
  verify: {start: sec(76), end: sec(84)},
  final: {start: sec(84), end: sec(90)},
} as const;

type EventType =
  | 'data_registered'
  | 'model_trained'
  | 'evaluation_reported'
  | 'human_approved'
  | 'model_promoted'
  | string;

export type GovAIDemoEvent = {
  // Some fixtures use `name`; normalize to `type` at runtime.
  type?: EventType;
  name?: string;
  timestamp?: string;
  actor?: string;
  hash?: string;
  fingerprint?: string;
  payload?: Record<string, unknown>;
};

export type GovAIDemoProps = {
  run_id: string;
  timestamp: string;
  base_url: string;
  chain_valid: boolean;
  compliance_decision: {state: string; reasons?: string[]};
  events: GovAIDemoEvent[];
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const invLerp = (a: number, b: number, v: number) => (a === b ? 0 : (v - a) / (b - a));
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);
const prog = (frame: number, start: number, end: number, easing = easeInOut) =>
  clamp01(
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing,
    }),
  );

const shortHash = (v: unknown, len = 14) => {
  const s = typeof v === 'string' ? v : v == null ? '' : String(v);
  if (!s) return '—';
  if (s.length <= len) return s;
  return `${s.slice(0, 6)}…${s.slice(-6)}`;
};

const formatIsoLike = (iso?: string) => (iso ? iso.replace('T', ' ').replace('Z', ' UTC') : '—');

const getEventType = (e: GovAIDemoEvent): EventType => (e.type ?? e.name ?? 'unknown') as EventType;

const normalizeEvent = (e: GovAIDemoEvent): Required<Pick<GovAIDemoEvent, 'type' | 'payload'>> & GovAIDemoEvent => ({
  ...e,
  type: getEventType(e),
  payload: e.payload ?? {},
});

const getEvent = (events: GovAIDemoEvent[], type: EventType): GovAIDemoEvent =>
  events.find((e) => getEventType(e) === type) ?? {type, payload: {}};

const getFingerprint = (events: GovAIDemoEvent[]) =>
  events.find((e) => e.fingerprint)?.fingerprint ??
  events.find((e) => e.hash)?.hash ??
  '—';

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: GOVAI_TOKENS.surfaceMid,
      border: `1px solid ${GOVAI_TOKENS.border}`,
      borderRadius: GOVAI_TOKENS.radiusCard,
      boxShadow: GOVAI_TOKENS.shadow,
      padding: 18,
      ...style,
    }}
  >
    {children}
  </div>
);

const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <span style={{fontFamily: GOVAI_TOKENS.fontMono, letterSpacing: 0.2, ...style}}>{children}</span>
);

const Chip: React.FC<{label: string; tone: 'muted' | 'success' | 'warning'}> = ({label, tone}) => {
  const bg =
    tone === 'success'
      ? 'rgba(134, 176, 146, 0.14)'
      : tone === 'warning'
        ? 'rgba(196, 154, 98, 0.14)'
        : 'rgba(139, 149, 163, 0.14)';
  const border =
    tone === 'success'
      ? 'rgba(134, 176, 146, 0.35)'
      : tone === 'warning'
        ? 'rgba(196, 154, 98, 0.35)'
        : GOVAI_TOKENS.border;
  const color =
    tone === 'success' ? GOVAI_TOKENS.success : tone === 'warning' ? GOVAI_TOKENS.warning : GOVAI_TOKENS.textSecondary;
  return (
    <span style={{display: 'inline-flex', padding: '6px 10px', borderRadius: 999, border: `1px solid ${border}`, background: bg, color, fontSize: 12}}>
      {label}
    </span>
  );
};

const Subtitle: React.FC<{frame: number}> = ({frame}) => {
  const blocks = [
    {t: T.opening, text: 'Initializing verifiable run context…'},
    {t: T.problem, text: 'The question is not only performance — it’s proof.'},
    {t: T.lifecycle, text: 'Ingesting evidence and committing lifecycle events to the audit chain.'},
    {t: T.compliance, text: 'Deriving compliance state from recorded evidence.'},
    {t: T.verify, text: 'Verifying chain integrity end-to-end.'},
    {t: T.final, text: 'Audit-ready AI governance — by design.'},
  ];
  const b = blocks.find((x) => frame >= x.t.start && frame < x.t.end);
  if (!b) return null;
  const a = prog(frame, b.t.start, b.t.start + sec(0.6), easeInOut);
  const z = prog(frame, b.t.end - sec(0.6), b.t.end, easeInOut);
  const opacity = a * (1 - z);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center', opacity}}>
      <div style={{maxWidth: 1180, padding: '10px 14px', borderRadius: 10, border: `1px solid ${GOVAI_TOKENS.borderSubtle}`, background: 'rgba(10, 12, 16, 0.55)', color: GOVAI_TOKENS.textSecondary, fontSize: 14, backdropFilter: 'blur(8px)'}}>
        {b.text}
      </div>
    </div>
  );
};

const Opening: React.FC<{frame: number; runId: string}> = ({frame, runId}) => {
  const opacity = prog(frame, T.opening.start, T.opening.start + sec(1.1), easeInOut) * (1 - prog(frame, T.opening.end - sec(0.8), T.opening.end, easeInOut));
  const y = interpolate(opacity, [0, 1], [18, 0]);
  const runStart = T.opening.start + sec(1.2);
  const revealed = Math.max(0, Math.min(runId.length, Math.floor((frame - runStart) / 2)));
  const shown = runId.slice(0, revealed).padEnd(runId.length, '·');
  return (
    <div style={{position: 'absolute', inset: 0, opacity, transform: `translateY(${y}px)`}}>
      <div style={{position: 'absolute', left: 96, top: 188, width: 900}}>
        <div style={{fontWeight: 800, fontSize: 56, letterSpacing: 0.4, color: GOVAI_TOKENS.textPrimary}}>GovAI Audit Processor</div>
        <div style={{marginTop: 18, fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.textSecondary, fontSize: 16}}>
          {'>'} create_run(<span style={{color: GOVAI_TOKENS.textMuted}}>run_id=</span>
          <span style={{color: GOVAI_TOKENS.textPrimary}}>{shown}</span>)
        </div>
      </div>
    </div>
  );
};

const Problem: React.FC<{frame: number}> = ({frame}) => {
  const opacity = prog(frame, T.problem.start, T.problem.start + sec(0.8), easeInOut) * (1 - prog(frame, T.problem.end - sec(0.7), T.problem.end, easeInOut));
  const qs = ['What happened — and when?', 'Which artifacts were used?', 'Who approved promotion?', 'Can we verify the chain after the fact?'];
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div style={{position: 'absolute', left: 96, top: 160}}>
        <div style={{fontWeight: 750, color: GOVAI_TOKENS.textPrimary, fontSize: 28}}>Proving compliance requires structured evidence.</div>
      </div>
      <div style={{position: 'absolute', left: 96, top: 210, width: 920}}>
        {qs.map((q, i) => {
          const p = prog(frame, T.problem.start + sec(0.8) + i * sec(1.3), T.problem.start + sec(1.5) + i * sec(1.3), easeOut);
          return (
            <div key={q} style={{display: 'flex', gap: 12, alignItems: 'center', marginTop: i ? 14 : 0, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`}}>
              <div style={{width: 10, height: 10, borderRadius: 99, background: `rgba(185,194,204,${0.22 + 0.25 * p})`, border: `1px solid ${GOVAI_TOKENS.border}`}} />
              <div style={{color: GOVAI_TOKENS.textSecondary, fontSize: 18}}>{q}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LABELS = ['data_registered', 'model_trained', 'evaluation_reported', 'human_approved', 'model_promoted'];

const AuditChain: React.FC<{frame: number; start: number; committed: number; commitProgress: number}> = ({frame, start, committed, commitProgress}) => {
  const opacity = prog(frame, start - sec(0.5), start + sec(0.6), easeInOut);
  const gapY = 86;
  const topY = 90;
  const lineLen = (LABELS.length - 1) * gapY;
  const full = Math.min(LABELS.length, committed + commitProgress);
  const linePx = (Math.max(0, Math.min(LABELS.length - 1, full - 1)) / (LABELS.length - 1)) * lineLen;
  const scan = 0.12 + 0.08 * Math.sin((frame - start) / 18);
  return (
    <Card style={{height: '100%', background: GOVAI_TOKENS.surfaceChrome, opacity}}>
      <div style={{fontWeight: 700, color: GOVAI_TOKENS.textPrimary, fontSize: 14}}>Audit chain</div>
      <div style={{position: 'relative', marginTop: 18, height: 520}}>
        <div style={{position: 'absolute', left: 40, top: topY, width: 2, height: lineLen, background: 'rgba(139,149,163,0.22)'}} />
        <div style={{position: 'absolute', left: 40, top: topY, width: 2, height: linePx, background: 'rgba(134,176,146,0.65)', boxShadow: `0 0 18px rgba(134,176,146,${0.16 + scan})`}} />
        {LABELS.map((l, i) => {
          const recorded = i < committed;
          const active = i === committed;
          const ap = prog(frame, start + i * sec(0.3), start + i * sec(0.3) + sec(0.55), easeOut);
          const ring = recorded || active ? `rgba(134,176,146,${recorded ? 0.55 : 0.35 + 0.15 * commitProgress})` : 'rgba(139,149,163,0.26)';
          const fill = recorded ? 'rgba(134,176,146,0.22)' : active ? `rgba(134,176,146,${0.10 + 0.10 * commitProgress})` : 'rgba(139,149,163,0.08)';
          return (
            <div key={l} style={{position: 'absolute', left: 0, top: topY + i * gapY, opacity: ap}}>
              <div style={{position: 'absolute', left: 30, top: -10, width: 20, height: 20, borderRadius: 99, background: fill, border: `1px solid ${ring}`}} />
              <div style={{marginLeft: 78}}>
                <div style={{color: GOVAI_TOKENS.textSecondary, fontSize: 13}}>{l}</div>
                <div style={{marginTop: 2, fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.textMuted, fontSize: 11}}>
                  {recorded ? 'RECORDED' : active ? 'COMMITTING…' : 'PENDING'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const RunState: React.FC<{frame: number; start: number; idx: number; commitProgress: number}> = ({frame, start, idx, commitProgress}) => {
  const opacity = prog(frame, start - sec(0.5), start + sec(0.6), easeInOut);
  const rows = [
    'DATA registered',
    'TRAINING complete',
    'EVALUATION reported',
    'APPROVAL recorded',
    'PROMOTION complete',
  ];
  return (
    <Card style={{height: '100%', background: GOVAI_TOKENS.surfaceChrome, opacity}}>
      <div style={{fontWeight: 700, color: GOVAI_TOKENS.textPrimary, fontSize: 14}}>Run state</div>
      <div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
        {rows.map((r, i) => {
          const ap = prog(frame, start + i * sec(0.35), start + i * sec(0.35) + sec(0.5), easeOut);
          const recorded = idx > i || (idx === i && commitProgress >= 0.98);
          const active = idx === i && !recorded;
          const tone = recorded ? 'success' : active ? 'warning' : 'muted';
          const label = recorded ? 'ok' : active ? 'processing' : 'pending';
          const bar = recorded ? 1 : active ? clamp01(commitProgress) : 0;
          return (
            <div key={r} style={{opacity: ap, border: `1px solid ${GOVAI_TOKENS.borderSubtle}`, borderRadius: 10, padding: 12, background: 'rgba(22,27,34,0.55)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{color: GOVAI_TOKENS.textSecondary, fontSize: 13}}>{r}</div>
                <Chip label={label} tone={tone} />
              </div>
              <div style={{marginTop: 10, height: 4, borderRadius: 99, background: 'rgba(139,149,163,0.16)', overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${Math.round(bar * 100)}%`, background: recorded ? 'rgba(134,176,146,0.65)' : 'rgba(196,154,98,0.70)'}} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const PAYLOAD_FIELDS = [
  'dataset_id',
  'dataset_version',
  'dataset_fingerprint',
  'ai_system_id',
  'model_id',
  'training_job_id',
  'eval_report_id',
  'precision',
  'recall',
  'false_positive_rate',
  'approver',
  'approval_id',
  'promotion_id',
  'environment',
];

const EvidencePacket: React.FC<{frame: number; start: number; idx: number; event: GovAIDemoEvent; phase: 'ingest' | 'expand' | 'commit'; phaseP: number}> = ({
  frame,
  start,
  idx,
  event,
  phase,
  phaseP,
}) => {
  const opacity = prog(frame, start - sec(0.5), start + sec(0.6), easeInOut);
  const y = phase === 'ingest' ? interpolate(phaseP, [0, 1], [-18, 0], {easing: easeOut}) : 0;
  const scale = phase === 'commit' ? interpolate(phaseP, [0, 1], [1, 0.96], {easing: easeInOut}) : 1;

  const raw = event.payload ?? {};
  const keys = PAYLOAD_FIELDS.filter((k) => Object.prototype.hasOwnProperty.call(raw, k));
  const ordered = (keys.length ? keys : Object.keys(raw)).slice(0, 8);
  const revealCount =
    ordered.length === 0
      ? 0
      : phase === 'expand'
        ? Math.max(1, Math.min(ordered.length, Math.floor(phaseP * (ordered.length + 1))))
        : phase === 'commit'
          ? ordered.length
          : Math.max(1, Math.min(ordered.length, Math.floor(phaseP * 3) + 1));

  const hash = shortHash(event.hash ?? event.fingerprint ?? '', 14);
  const pulse = 0.4 + 0.6 * Math.sin((frame - start) / 10);
  const hashOpacity = phase === 'commit' ? 0.5 + 0.25 * (1 - phaseP) : 0.55 + 0.25 * pulse;

  return (
    <Card style={{height: '100%', opacity, transform: `translateY(${y}px) scale(${scale})`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontWeight: 700, color: GOVAI_TOKENS.textPrimary, fontSize: 14}}>Evidence packet • {LABELS[idx]}</div>
        <Chip label={phase === 'commit' ? 'committing' : phase === 'expand' ? 'decoding' : 'ingesting'} tone={phase === 'commit' ? 'warning' : 'muted'} />
      </div>
      <div style={{marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: 16, color: GOVAI_TOKENS.textMuted, fontSize: 12}}>
        <div>
          actor: <Mono style={{color: GOVAI_TOKENS.textSecondary}}>{event.actor ?? '—'}</Mono>
        </div>
        <div>
          ts: <Mono style={{color: GOVAI_TOKENS.textSecondary}}>{formatIsoLike(event.timestamp)}</Mono>
        </div>
      </div>
      <div style={{marginTop: 10, color: GOVAI_TOKENS.textMuted, fontSize: 12}}>
        fingerprint: <Mono style={{color: GOVAI_TOKENS.textSecondary, opacity: hashOpacity}}>{hash}</Mono>
      </div>
      <div style={{marginTop: 16, borderTop: `1px solid ${GOVAI_TOKENS.borderSubtle}`, paddingTop: 14}}>
        <div style={{color: GOVAI_TOKENS.textSecondary, fontSize: 12}}>payload fields</div>
        <div style={{marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          {ordered.slice(0, revealCount).map((k, i) => {
            const s = i * 0.085;
            const p = phase === 'expand' ? clamp01((phaseP - s) / (1 - s)) : 1;
            return (
              <div key={k} style={{opacity: p, transform: `translateY(${interpolate(p, [0, 1], [6, 0])}px)`, border: `1px solid ${GOVAI_TOKENS.borderSubtle}`, borderRadius: 10, padding: '10px 10px', background: 'rgba(17,21,27,0.6)'}}>
                <div style={{fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.textMuted, fontSize: 11}}>{k}</div>
                <div style={{marginTop: 6, fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.textSecondary, fontSize: 12}}>
                  {typeof (raw as Record<string, unknown>)[k] === 'string' ? ((raw as Record<string, unknown>)[k] as string) : JSON.stringify((raw as Record<string, unknown>)[k] ?? '—')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

const Lifecycle: React.FC<{frame: number; eventsStrict: GovAIDemoEvent[]}> = ({frame, eventsStrict}) => {
  const start = T.lifecycle.start;
  const end = T.lifecycle.end;
  const opacity = prog(frame, start, start + sec(0.8), easeInOut) * (1 - prog(frame, end - sec(0.8), end, easeInOut));

  const total = 5;
  const window = (end - start) / total;
  const t = clamp01(invLerp(start, end, frame));
  const idx = Math.min(total - 1, Math.max(0, Math.floor(t * total)));
  const local = clamp01(invLerp(start + idx * window, start + (idx + 1) * window, frame));
  const ingestEnd = 0.24;
  const expandEnd = 0.74;
  const phase: 'ingest' | 'expand' | 'commit' = local < ingestEnd ? 'ingest' : local < expandEnd ? 'expand' : 'commit';
  const phaseP = phase === 'ingest' ? clamp01(local / ingestEnd) : phase === 'expand' ? clamp01((local - ingestEnd) / (expandEnd - ingestEnd)) : clamp01((local - expandEnd) / (1 - expandEnd));
  const committed = idx + (phase === 'commit' ? (phaseP >= 0.98 ? 1 : 0) : 0);
  const commitProgress = phase === 'commit' ? phaseP : 0;

  const dx = phase === 'commit' ? interpolate(phaseP, [0, 1], [0, -34], {easing: easeInOut}) : 0;
  const dy = phase === 'commit' ? interpolate(phaseP, [0, 1], [0, 14], {easing: easeInOut}) : 0;
  const f = phase === 'commit' ? interpolate(phaseP, [0, 1], [1, 0.9], {easing: easeInOut}) : 1;

  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 110, bottom: 86, opacity}}>
      <div style={{position: 'absolute', left: 28, right: 28, top: 0, bottom: 0, display: 'flex', gap: 18}}>
        <div style={{width: 420}}>
          <AuditChain frame={frame} start={start} committed={Math.min(LABELS.length, committed)} commitProgress={commitProgress} />
        </div>
        <div style={{flex: 1, transform: `translate(${dx}px, ${dy}px)`, opacity: f}}>
          <EvidencePacket frame={frame} start={start} idx={idx} event={eventsStrict[idx]} phase={phase} phaseP={phaseP} />
        </div>
        <div style={{width: 420}}>
          <RunState frame={frame} start={start} idx={idx} commitProgress={commitProgress} />
        </div>
      </div>
    </div>
  );
};

const Compliance: React.FC<{frame: number; state: string}> = ({frame, state}) => {
  const start = T.compliance.start;
  const end = T.compliance.end;
  const opacity = prog(frame, start, start + sec(0.7), easeInOut) * (1 - prog(frame, end - sec(0.7), end, easeInOut));
  const checks = ['Evidence present (5/5)', 'Approvals recorded', 'Promotion gated', 'Chain integrity intact'];
  const done = Math.min(checks.length, Math.max(0, Math.floor(prog(frame, start + sec(0.6), start + sec(5.3), easeInOut) * (checks.length + 0.5))));
  const validP = prog(frame, start + sec(5.4), start + sec(6.8), easeOut);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 110, bottom: 86, opacity}}>
      <div style={{position: 'absolute', left: 28, right: 28, top: 0, bottom: 0, display: 'flex', gap: 18}}>
        <div style={{width: 420}}>
          <Card style={{height: '100%', background: GOVAI_TOKENS.surfaceChrome}}>
            <div style={{fontWeight: 700, color: GOVAI_TOKENS.textPrimary, fontSize: 14}}>Derivation</div>
            <div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
              {checks.map((c, i) => (
                <div key={c} style={{display: 'flex', justifyContent: 'space-between', border: `1px solid ${GOVAI_TOKENS.borderSubtle}`, borderRadius: 10, padding: 12, background: 'rgba(22,27,34,0.55)'}}>
                  <div style={{color: GOVAI_TOKENS.textSecondary, fontSize: 13}}>{c}</div>
                  <Chip label={i < done ? 'pass' : 'pending'} tone={i < done ? 'success' : 'muted'} />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div style={{flex: 1}}>
          <Card style={{height: '100%'}}>
            <div style={{fontWeight: 700, color: GOVAI_TOKENS.textPrimary, fontSize: 14}}>Derived compliance output</div>
            <div style={{marginTop: 26, border: `1px solid ${GOVAI_TOKENS.borderSubtle}`, borderRadius: 12, padding: 16, background: 'rgba(17,21,27,0.6)'}}>
              <div style={{fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.textMuted, fontSize: 11}}>STATE</div>
              <div style={{marginTop: 10, fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.success, fontSize: 34, opacity: validP, transform: `translateY(${interpolate(validP, [0, 1], [10, 0])}px)`}}>
                {state || 'VALID'}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Verify: React.FC<{frame: number; chainValid: boolean; fingerprint: string}> = ({frame, chainValid, fingerprint}) => {
  const start = T.verify.start;
  const end = T.verify.end;
  const opacity = prog(frame, start, start + sec(0.7), easeInOut) * (1 - prog(frame, end - sec(0.7), end, easeInOut));
  const chainP = prog(frame, start + sec(4.9), start + sec(7.2), easeOut);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 110, bottom: 86, opacity}}>
      <div style={{position: 'absolute', left: 28, right: 28, top: 0, bottom: 0, display: 'flex', gap: 18}}>
        <div style={{flex: 1}}>
          <Card style={{height: '100%'}}>
            <div style={{fontWeight: 700, color: GOVAI_TOKENS.textPrimary, fontSize: 14}}>Hash chain verification</div>
            <div style={{marginTop: 20, border: `1px solid ${GOVAI_TOKENS.borderSubtle}`, borderRadius: 12, padding: 14, background: 'rgba(17,21,27,0.6)'}}>
              <div style={{fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.textMuted, fontSize: 11}}>CHAIN_VALID</div>
              <div style={{marginTop: 10, fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.success, fontSize: 22, opacity: chainP}}>
                {chainValid ? 'true' : 'false'}
              </div>
              <div style={{marginTop: 10, fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.textMuted, fontSize: 11}}>FINGERPRINT: {shortHash(fingerprint, 20)}</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Final: React.FC<{frame: number}> = ({frame}) => {
  const opacity = prog(frame, T.final.start, T.final.start + sec(0.7), easeInOut) * (1 - prog(frame, T.final.end - sec(0.9), T.final.end, easeInOut));
  return (
    <div style={{position: 'absolute', inset: 0, opacity, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 980}}>
        <Card style={{padding: 28, background: GOVAI_TOKENS.surfaceChrome}}>
          <div style={{fontWeight: 850, color: GOVAI_TOKENS.textPrimary, fontSize: 34}}>Audit-ready AI governance</div>
          <div style={{marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
            <Chip label="EVIDENCE: complete" tone="success" />
            <Chip label="STATE: VALID" tone="success" />
            <Chip label="CHAIN_VALID: true" tone="success" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export const GovAIDemo: React.FC<GovAIDemoProps> = (props) => {
  const frame = useCurrentFrame();
  const eventsNormalized = props.events.map(normalizeEvent);
  const fingerprint = getFingerprint(eventsNormalized);
  const eventsStrict: GovAIDemoEvent[] = [
    getEvent(eventsNormalized, 'data_registered'),
    getEvent(eventsNormalized, 'model_trained'),
    getEvent(eventsNormalized, 'evaluation_reported'),
    getEvent(eventsNormalized, 'human_approved'),
    getEvent(eventsNormalized, 'model_promoted'),
  ];

  const bedVolume = 0.28 * prog(frame, 0, sec(1.2), easeInOut) * (1 - prog(frame, GOVAI_DEMO_DURATION_IN_FRAMES - sec(1.4), GOVAI_DEMO_DURATION_IN_FRAMES, easeInOut));
  const voiceoverVolume = 0.92;

  const topbarOpacity = prog(frame, sec(2.0), sec(3.0), easeInOut);

  return (
    <AbsoluteFill style={{background: GOVAI_TOKENS.bg, color: GOVAI_TOKENS.textPrimary, fontFamily: GOVAI_TOKENS.fontUi}}>
      {ENABLE_BED_AUDIO ? <Audio src={staticFile(GOVAI_DEMO_AUDIO_BED_PATH)} volume={bedVolume} /> : null}
      {ENABLE_VOICEOVER ? <Audio src={staticFile(GOVAI_DEMO_AUDIO_VOICEOVER_PATH)} volume={voiceoverVolume} /> : null}

      <AbsoluteFill style={{background: 'radial-gradient(1200px 700px at 70% 20%, rgba(134,176,146,0.06), rgba(11,14,19,0) 55%), radial-gradient(900px 520px at 12% 10%, rgba(139,149,163,0.06), rgba(11,14,19,0) 60%)'}} />

      <div style={{position: 'absolute', top: 24, left: 28, right: 28, display: 'flex', justifyContent: 'space-between', opacity: topbarOpacity}}>
        <div style={{display: 'flex', gap: 14, alignItems: 'baseline'}}>
          <div style={{fontWeight: 700, letterSpacing: 0.4}}>GovAI</div>
          <Chip label={`run_id: ${props.run_id}`} tone="muted" />
        </div>
        <div style={{fontFamily: GOVAI_TOKENS.fontMono, color: GOVAI_TOKENS.textMuted, fontSize: 12}}>{formatIsoLike(props.timestamp)}</div>
      </div>

      <Opening frame={frame} runId={props.run_id} />
      <Problem frame={frame} />
      <Lifecycle frame={frame} eventsStrict={eventsStrict} />
      <Compliance frame={frame} state={props.compliance_decision?.state ?? 'VALID'} />
      <Verify frame={frame} chainValid={props.chain_valid} fingerprint={fingerprint} />
      <Final frame={frame} />
      <Subtitle frame={frame} />
    </AbsoluteFill>
  );
};

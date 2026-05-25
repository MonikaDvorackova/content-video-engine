import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {motion} from 'framer-motion';
import {SlideShell} from '../../deck/SlideShell';
import {BulletList, Headline, Subhead, Title} from '../../deck/typography';
import {CIPipeline, Card, Chip, EvidenceChain, Gate, ReasonCode, SignatureStamp} from '../../deck/primitives';
import {GOVAI_DECK_SLIDES, SLIDE_DURATIONS} from '../../deck/slides';

export type GovAIInvestorDeckProps = {
  speaker: boolean;
  staticExport?: boolean;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const SlideIn: React.FC<{children: React.ReactNode; delay?: number; staticExport?: boolean}> = ({
  children,
  delay = 0,
  staticExport,
}) => {
  if (staticExport) {
    return <>{children}</>;
  }
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 110, mass: 0.9}});
  const y = interpolate(p, [0, 1], [14, 0]);
  const o = clamp01(p);
  return (
    <motion.div style={{opacity: o, transform: `translateY(${y}px)`}}>
      {children}
    </motion.div>
  );
};

const CoverLogo: React.FC<{staticExport?: boolean}> = ({staticExport}) => {
  const [failed, setFailed] = React.useState(false);
  if (failed) {
    return (
      <div className="text-[12px] font-[800] tracking-[0.16em] text-[color:var(--govai-text-2)]">
        GOVAI
      </div>
    );
  }

  return (
    <Img
      src={staticFile('logo.png')}
      className={staticExport ? 'h-[40px] w-auto opacity-[1]' : 'h-[26px] w-auto opacity-[0.92]'}
      style={staticExport ? undefined : {filter: 'grayscale(1) contrast(1.05)'}}
      // eslint-disable-next-line react/jsx-no-bind
      onError={() => setFailed(true)}
    />
  );
};

const TwoCol: React.FC<{left: React.ReactNode; right: React.ReactNode}> = ({left, right}) => (
  <div className="grid grid-cols-[1.08fr_0.92fr] gap-[64px] items-start">
    <div>{left}</div>
    <div>{right}</div>
  </div>
);

const CoverVisual: React.FC = () => (
  <div className="flex flex-col gap-5">
    <Gate state="neutral" label="Governance gate" />
    <EvidenceChain
      items={[
        'eval report attached',
        'dataset lineage bound',
        'approval scoped',
        'policy satisfied',
        'provenance signed',
      ]}
      active={4}
    />
    <div className="pt-2">
      <SignatureStamp />
    </div>
  </div>
);

const ProblemVisual: React.FC = () => (
  <Card className="p-5 bg-[color:var(--govai-surface-0)]">
    <div className="flex items-center justify-between">
      <div className="text-[13px] font-[700] text-[color:var(--govai-text)]">Release pipeline</div>
      <Chip label="NON-BLOCKING" tone="muted" />
    </div>
    <div className="mt-4">
      <CIPipeline
        steps={[
          {label: 'build', state: 'allow', note: 'compiled'},
          {label: 'tests', state: 'allow', note: 'pass'},
          {label: 'model eval', state: 'allow', note: 'green'},
          {label: 'deploy', state: 'allow', note: 'promoted'},
        ]}
        highlightIndex={3}
      />
    </div>
    <div className="mt-5 rounded-[12px] border border-[color:var(--govai-border-subtle)] bg-[rgba(10,12,16,0.55)] px-4 py-3">
      <div className="text-[12px] text-[color:var(--govai-text-3)]">Governance checks often live off-path:</div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip label="spreadsheet" tone="muted" />
        <Chip label="wiki policy" tone="muted" />
        <Chip label="ticket approval" tone="muted" />
        <Chip label="audit report" tone="muted" />
      </div>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-[12px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] px-4 py-3">
        <div className="text-[11px] tracking-[0.14em] uppercase text-[color:var(--govai-text-3)]">
          Model centric validation
        </div>
        <div className="mt-2 text-[13px] leading-[1.45] text-[color:var(--govai-text-2)]">
          Metrics, benchmarks, safety checks.
        </div>
      </div>
      <div className="rounded-[12px] border border-[rgba(134,176,146,0.26)] bg-[rgba(134,176,146,0.06)] px-4 py-3">
        <div className="text-[11px] tracking-[0.14em] uppercase text-[color:var(--govai-text-3)]">
          Decision centric enforcement
        </div>
        <div className="mt-2 text-[13px] leading-[1.45] text-[color:var(--govai-text-2)]">
          Evidence, approvals, traceability — enforced.
        </div>
      </div>
    </div>
  </Card>
);

const WhyFailsVisual: React.FC = () => (
  <div className="flex flex-col gap-4">
    <Card className="p-5 bg-[color:var(--govai-surface-0)]">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-[700]">Policy artifacts</div>
        <Chip label="DECLARATIVE" tone="muted" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-[12px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] px-4 py-3 text-[13px] text-[color:var(--govai-text-2)]">
          Wiki page
        </div>
        <div className="rounded-[12px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] px-4 py-3 text-[13px] text-[color:var(--govai-text-2)]">
          Checklist doc
        </div>
      </div>
    </Card>
    <Gate state="deny" label="Deploy-time enforcement" />
    <div className="grid grid-cols-2 gap-3">
      <ReasonCode code="GOVAI_EVID_102" text="missing artifact-scoped approval" tone="deny" />
      <ReasonCode code="GOVAI_POL_207" text="policy contract not satisfied" tone="deny" />
    </div>
  </div>
);

const ComparisonVisual: React.FC = () => (
  <Card className="p-6 bg-[color:var(--govai-surface-0)]">
    <div className="flex items-center justify-between">
      <div className="text-[13px] font-[700]">Category comparison</div>
      <Chip label="ENFORCEMENT" tone="muted" />
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      {[
        {t: 'Observability', s: 'detects', n: 'alerts after the fact', tone: 'muted' as const},
        {t: 'GRC', s: 'documents', n: 'controls are not executed', tone: 'muted' as const},
        {t: 'Eval platforms', s: 'validate', n: 'models, not deployed decisions', tone: 'muted' as const},
        {t: 'CI', s: 'orchestrates', n: 'runs steps but doesn’t enforce governance', tone: 'muted' as const},
      ].map((x) => (
        <div
          key={x.t}
          className="rounded-[14px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-[720] text-[color:var(--govai-text)]">{x.t}</div>
            <Chip label={x.s} tone={x.tone} />
          </div>
          <div className="mt-2 text-[13px] text-[color:var(--govai-text-2)]">{x.n}</div>
        </div>
      ))}
    </div>
    <div className="mt-5">
      <Gate state="deny" label="GovAI enforcement layer: blocks non-compliant promotion" />
    </div>
    <div className="mt-3 grid grid-cols-2 gap-3">
      <ReasonCode code="FAIL_CLOSED" text="no evidence → no deploy" tone="deny" />
      <ReasonCode code="ARTIFACT_BOUND" text="proof bound to what ships" tone="allow" />
    </div>
  </Card>
);

const VideoDemoVisual: React.FC = () => (
  <Card className="p-6 bg-[color:var(--govai-surface-0)]">
    <div className="flex items-center justify-between">
      <div className="text-[13px] font-[700]">Demo preview</div>
      <Chip label="VIDEO" tone="muted" />
    </div>
    <div className="mt-5 relative overflow-hidden rounded-[16px] border border-[color:var(--govai-border-subtle)] bg-[rgba(10,12,16,0.55)] p-4">
      <div className="absolute right-4 top-4 rounded-[999px] border border-[color:var(--govai-border-subtle)] bg-[rgba(10,12,16,0.65)] px-3 py-1 font-mono text-[11px] text-[color:var(--govai-text-3)]">
        deterministic
      </div>
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-[999px] border border-[color:var(--govai-border-subtle)] bg-[rgba(10,12,16,0.65)] px-3 py-1">
        <div className="h-[0px] w-[0px] border-y-[7px] border-y-transparent border-l-[12px] border-l-[color:var(--govai-text-2)]" />
        <div className="text-[12px] text-[color:var(--govai-text-2)]">play</div>
      </div>
      <DemoSequenceVisual />
    </div>
  </Card>
);

const ArchitectureFlowVisual: React.FC = () => (
  <Card className="p-6 bg-[color:var(--govai-surface-0)]">
    <div className="flex items-center justify-between">
      <div className="text-[13px] font-[700]">Enforced promotion path</div>
      <Chip label="FAIL-CLOSED" tone="muted" />
    </div>
    <div className="mt-5">
      <CIPipeline
        steps={[
          {label: 'PR', state: 'allow', note: 'change request'},
          {label: 'evidence', state: 'neutral', note: 'assembly'},
          {label: 'policy', state: 'neutral', note: 'evaluation'},
          {label: 'approvals', state: 'neutral', note: 'verification'},
          {label: 'signed package', state: 'neutral', note: 'decision bundle'},
          {label: 'allow / block', state: 'neutral', note: 'promotion gate'},
        ]}
        highlightIndex={3}
      />
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <ReasonCode code="ALLOW" text="signed decision package → promote" tone="allow" />
      <ReasonCode code="BLOCK" text="policy violation → block with reason codes" tone="deny" />
    </div>
  </Card>
);

const MarketVisual: React.FC = () => <AIAcVisual />;

const DemoSequenceVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = (t: number) => Math.max(0, Math.min(1, t));
  const f = frame;

  const p0 = phase((f - 0) / 18); // PR opened
  const p1 = phase((f - 18) / 22); // artifact changed
  const p2 = phase((f - 40) / 24); // CI triggered
  const p3 = phase((f - 64) / 30); // evidence bundle
  const p4 = phase((f - 94) / 28); // policy eval
  const p5 = phase((f - 122) / 24); // missing approval => blocked
  const p6 = phase((f - 146) / 26); // approval attached
  const p7 = phase((f - 172) / 28); // re-eval
  const p8 = phase((f - 200) / 26); // signed + allow

  const stepOn = (p: number) => p >= 0.92;
  const done = [
    stepOn(p0),
    stepOn(p1),
    stepOn(p2),
    stepOn(p3),
    stepOn(p4),
    stepOn(p5),
    stepOn(p6),
    stepOn(p7),
    stepOn(p8),
  ];

  const blocked = done[5] && !done[8];
  const allowed = done[8];

  const highlight =
    done.findIndex((x, i) => !x && (i === 0 || done[i - 1])) === -1 ? 8 : done.findIndex((x) => !x);

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5 bg-[color:var(--govai-surface-0)]">
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-[700]">Pull request → release gate</div>
          <Chip label={allowed ? 'ALLOW' : blocked ? 'BLOCKED' : 'EVALUATING'} tone={allowed ? 'success' : blocked ? 'danger' : 'muted'} />
        </div>
        <div className="mt-4">
          <CIPipeline
            steps={[
              {label: 'PR opened', state: done[0] ? 'allow' : 'neutral', note: 'change request'},
              {label: 'artifact changed', state: done[1] ? 'allow' : 'neutral', note: 'model/prompt/routing'},
              {label: 'CI triggered', state: done[2] ? 'allow' : 'neutral', note: 'build + tests'},
              {label: 'evidence bundle', state: done[3] ? 'allow' : 'neutral', note: 'evals • lineage • logs'},
              {label: 'policy eval', state: done[4] ? (blocked ? 'deny' : 'allow') : 'neutral', note: 'evidence contract'},
              {label: blocked ? 'BLOCKED' : allowed ? 'promote' : 'gate', state: allowed ? 'allow' : blocked ? 'deny' : 'neutral', note: blocked ? 'missing approval' : allowed ? 'signed bundle' : 'pending'},
            ]}
            highlightIndex={Math.min(5, Math.max(0, highlight))}
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip label="artifact_hash: a1c2d3…9f0e12" tone="muted" />
          <Chip label="policy: high-impact decision" tone="muted" />
          <Chip label={blocked ? 'approval: missing' : allowed ? 'approval: attached' : 'approval: pending'} tone={blocked ? 'danger' : allowed ? 'success' : 'warning'} />
        </div>
      </Card>

      <Card className="p-5 bg-[color:var(--govai-surface-0)]">
        <div className="flex items-center justify-between">
          <div className="text-[12px] tracking-[0.14em] uppercase text-[color:var(--govai-text-3)]">
            deterministic output
          </div>
          {allowed ? <SignatureStamp /> : null}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {blocked ? (
            <>
              <ReasonCode code="GOVAI_APPROVAL_011" text="missing artifact-scoped approval" tone="deny" />
              <ReasonCode code="GOVAI_EVID_102" text="evidence contract incomplete for decision class" tone="deny" />
            </>
          ) : allowed ? (
            <>
              <ReasonCode code="GOVAI_ALLOW" text="evidence contract satisfied" tone="allow" />
              <ReasonCode code="GOVAI_SIG" text="signed decision package bound to artifact hash" tone="allow" />
            </>
          ) : (
            <>
              <ReasonCode code="GOVAI_EVAL" text="evaluating policy contract…" tone="neutral" />
              <ReasonCode code="GOVAI_SCAN" text="assembling evidence bundle…" tone="neutral" />
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

const AIAcVisual: React.FC = () => (
  <Card className="p-6 bg-[color:var(--govai-surface-0)]">
    <div className="text-[13px] font-[700]">Requirement → control → enforcement</div>
    <div className="mt-5 grid grid-cols-3 gap-3">
      {[
        {req: 'Traceability', ctl: 'artifact-bound provenance', ep: 'CI + runtime'},
        {req: 'Human oversight', ctl: 'scoped approvals', ep: 'promotion gate'},
        {req: 'Change control', ctl: 'evidence contract', ep: 'release gate'},
      ].map((r) => (
        <div key={r.req} className="rounded-[14px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] p-4">
          <div className="text-[12px] text-[color:var(--govai-text-3)]">Requirement</div>
          <div className="mt-1 text-[14px] text-[color:var(--govai-text)]">{r.req}</div>
          <div className="mt-4 text-[12px] text-[color:var(--govai-text-3)]">Control</div>
          <div className="mt-1 font-mono text-[12px] text-[color:var(--govai-text-2)]">{r.ctl}</div>
          <div className="mt-4 text-[12px] text-[color:var(--govai-text-3)]">Enforced at</div>
          <div className="mt-1 font-mono text-[12px] text-[color:var(--govai-text-2)]">{r.ep}</div>
        </div>
      ))}
    </div>
  </Card>
);

const RoadmapVisual: React.FC = () => (
  <Card className="p-6 bg-[color:var(--govai-surface-0)]">
    <div className="text-[13px] font-[700]">Enforcement surface area</div>
    <div className="mt-5 grid grid-cols-3 gap-3">
      {[
        {t: '1', a: 'CI enforcement', s: 'block promotion deterministically'},
        {t: '2', a: 'Runtime decision gating', s: 'low-latency allow/deny'},
        {t: '3', a: 'Policy control plane', s: 'versioned policies + scopes'},
        {t: '4', a: 'Evidence contracts', s: 'machine-checkable requirements'},
        {t: '5', a: 'Multi-agent governance', s: 'agentic systems, enforced'},
      ].map((x, i) => (
        <div key={x.t} className="rounded-[14px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] p-4">
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-[color:var(--govai-text-3)]">Step</div>
            <Chip label={x.t} tone="muted" />
          </div>
          <div className="mt-3 text-[15px] font-[700] text-[color:var(--govai-text)]">{x.a}</div>
          <div className="mt-2 font-mono text-[12px] text-[color:var(--govai-text-2)]">{x.s}</div>
        </div>
      ))}
    </div>
    <div className="mt-5">
      <Gate state="neutral" label="Universal enforcement fabric" />
    </div>
  </Card>
);

const GTMVisual: React.FC = () => (
  <Card className="p-6 bg-[color:var(--govai-surface-0)]">
    <div className="flex items-center justify-between">
      <div className="text-[13px] font-[700]">GTM</div>
      <Chip label="B2B INFRA" tone="muted" />
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-[14px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] p-4">
        <div className="text-[12px] text-[color:var(--govai-text-3)]">Buyers</div>
        <div className="mt-2 text-[13px] text-[color:var(--govai-text-2)]">AI platform • security • governance engineering</div>
      </div>
      <div className="rounded-[14px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] p-4">
        <div className="text-[12px] text-[color:var(--govai-text-3)]">Wedge</div>
        <div className="mt-2 text-[13px] text-[color:var(--govai-text-2)]">Promotion gate that blocks non-compliant releases</div>
      </div>
      <div className="rounded-[14px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] p-4">
        <div className="text-[12px] text-[color:var(--govai-text-3)]">Segments</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip label="regulated enterprises" tone="muted" />
          <Chip label="AI-native companies" tone="muted" />
        </div>
      </div>
      <div className="rounded-[14px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] p-4">
        <div className="text-[12px] text-[color:var(--govai-text-3)]">Integrations</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip label="CI" tone="muted" />
          <Chip label="model registry" tone="muted" />
          <Chip label="approvals" tone="muted" />
          <Chip label="artifact store" tone="muted" />
        </div>
      </div>
    </div>
    <div className="mt-5">
      <ReasonCode code="DESIGN_PARTNERS" text="actively in design partner conversations" tone="neutral" />
    </div>
  </Card>
);

const TeamVisual: React.FC = () => (
  <Card className="p-6 bg-[color:var(--govai-surface-0)]">
    <div className="flex items-center justify-between">
      <div className="text-[13px] font-[700]">Team</div>
      <Chip label="FOUNDER" tone="muted" />
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      {[
        {k: 'AI engineering', v: 'production LLM systems'},
        {k: 'NLP / MLOps', v: 'evaluation + delivery pipelines'},
        {k: 'Law + governance', v: 'policy, oversight, accountability'},
        {k: 'Mathematics', v: 'formal, deterministic methods'},
      ].map((x) => (
        <div key={x.k} className="rounded-[14px] border border-[color:var(--govai-border-subtle)] bg-[rgba(139,149,163,0.06)] p-4">
          <div className="text-[14px] font-[720] text-[color:var(--govai-text)]">{x.k}</div>
          <div className="mt-2 text-[13px] text-[color:var(--govai-text-2)]">{x.v}</div>
        </div>
      ))}
    </div>
  </Card>
);

const AskVisual: React.FC = () => (
  <div className="flex flex-col gap-4">
    <Gate state="allow" label="Governance enforced" />
    <Card className="p-6 bg-[color:var(--govai-surface-0)]">
      <div className="text-[12px] tracking-[0.14em] uppercase text-[color:var(--govai-text-3)]">asks</div>
      <div className="mt-4 flex flex-col gap-3">
        <ReasonCode code="STAGE" text="pre-seed / seed" tone="neutral" />
        <ReasonCode code="RAISE" text="[fundraising target] to ship enforcement into production pipelines" tone="neutral" />
        <ReasonCode code="USE" text="CI enforcement → runtime gating → policy control plane" tone="neutral" />
        <ReasonCode code="CTA" text="design partners + platform integration partners" tone="neutral" />
      </div>
    </Card>
  </div>
);

const SlideBody: React.FC<{idx: number; staticExport?: boolean}> = ({idx, staticExport}) => {
  const s = GOVAI_DECK_SLIDES[idx];
  const left = (
    <div>
      {idx === 0 ? (
        <>
          <div className="mt-2">
            <CoverLogo staticExport={staticExport} />
          </div>
          <Title>{s.headline}</Title>
          <Subhead className="mt-4">AI governance enforcement infrastructure</Subhead>
          <div className="mt-3 text-[14px] leading-[1.55] text-[color:var(--govai-text-3)]">
            GovAI blocks AI deployments that violate governance policy before they reach production.
          </div>
          <div className="mt-8 font-mono text-[12px] tracking-[0.10em] text-[color:var(--govai-text-3)]">
            Evidence • Traceability • Approval • Enforcement
          </div>
        </>
      ) : (
        <>
          <Headline>{s.headline}</Headline>
          {s.bullets.length ? <BulletList items={s.bullets} /> : null}
        </>
      )}
    </div>
  );

  const right =
    idx === 0 ? (
      <CoverVisual />
    ) : idx === 1 ? (
      <ProblemVisual />
    ) : idx === 2 ? (
      <ComparisonVisual />
    ) : idx === 3 ? (
      <VideoDemoVisual />
    ) : idx === 4 ? (
      <ArchitectureFlowVisual />
    ) : idx === 5 ? (
      <MarketVisual />
    ) : idx === 6 ? (
      <RoadmapVisual />
    ) : idx === 7 ? (
      <GTMVisual />
    ) : idx === 8 ? (
      <TeamVisual />
    ) : (
      <AskVisual />
    );

  return (
    <TwoCol
      left={
        <SlideIn delay={0} staticExport={staticExport}>
          {left}
        </SlideIn>
      }
      right={
        <SlideIn delay={10} staticExport={staticExport}>
          {right}
        </SlideIn>
      }
    />
  );
};

export const GovAIInvestorDeck: React.FC<GovAIInvestorDeckProps> = ({speaker, staticExport}) => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('audio/govai-investor-deck-voiceover-fast.mp3')} />
      {GOVAI_DECK_SLIDES.map((s, idx) => {
        const from = SLIDE_DURATIONS.slice(0, idx).reduce((a, b) => a + b, 0);
        const durationInFrames = SLIDE_DURATIONS[idx] ?? 240;
        return (
          <Sequence key={s.title} from={from} durationInFrames={durationInFrames}>
          <SlideShell
            slideNo={idx + 1}
            title={s.title}
            kicker={s.kicker}
            speaker={speaker}
            speakerNotes={s.speakerNotes}
          >
            <SlideBody idx={idx} staticExport={staticExport} />
          </SlideShell>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};


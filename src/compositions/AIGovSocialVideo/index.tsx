import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import type {
  RenderBrief,
  SceneBeat,
} from '../../creative/types';

export const SOCIAL_FPS = 30;

const TOKENS = {
  bg: '#070A10',
  surface: '#10151F',
  surfaceStrong: '#151C28',
  surfaceSoft: '#0C1119',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D8E2',
  textMuted: '#8793A4',
  accent: '#4D7CFF',
  accentBright: '#7196FF',
  success: '#84D6A2',
  warning: '#E3B66F',
  border: 'rgba(190,202,220,0.24)',
  borderStrong: 'rgba(190,202,220,0.42)',
  borderSubtle: 'rgba(190,202,220,0.12)',
  font:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

type Story = RenderBrief['story'];

const clamp01 = (value: number) =>
  Math.max(0, Math.min(1, value));

const p = (
  value: number,
  start: number,
  end: number,
) =>
  clamp01(
    interpolate(value, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }),
  );

const move = (
  value: number,
  from: number,
  to: number,
) =>
  interpolate(value, [0, 1], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const humanize = (value: string) =>
  value.replace(/_/g, ' ');

const percent = (value: number) =>
  `${Math.round(value * 100)}%`;

const headlineSize = (
  text: string | undefined,
  hook: boolean,
) => {
  const length = (text ?? '').length;

  if (hook) {
    if (length > 110) return 62;
    if (length > 80) return 70;
    return 82;
  }

  if (length > 120) return 48;
  if (length > 85) return 54;
  return 60;
};

const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => (
  <div
    style={{
      borderRadius: 24,
      border: `1px solid ${TOKENS.border}`,
      background: TOKENS.surface,
      padding: 28,
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionLabel: React.FC<{
  children: React.ReactNode;
}> = ({children}) => (
  <div
    style={{
      color: TOKENS.accentBright,
      fontSize: 14,
      fontWeight: 800,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const Header: React.FC<{
  story: Story;
  scene: SceneBeat;
  enter: number;
}> = ({story, scene, enter}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      opacity: enter,
      transform: `translateY(${move(
        enter,
        -12,
        0,
      )}px)`,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: TOKENS.accent,
          boxShadow:
            '0 0 18px rgba(77,124,255,0.5)',
        }}
      />

      <div
        style={{
          fontSize: 17,
          fontWeight: 750,
          letterSpacing: 2,
          color: TOKENS.textSecondary,
          textTransform: 'uppercase',
        }}
      >
        AIGov Intelligence
      </div>
    </div>

    <div
      style={{
        display: 'flex',
        gap: 9,
      }}
    >
      <div
        style={{
          border: `1px solid ${TOKENS.border}`,
          borderRadius: 999,
          padding: '7px 12px',
          fontSize: 13,
          color: TOKENS.textSecondary,
          textTransform: 'uppercase',
        }}
      >
        {humanize(story.sourceType)}
      </div>

      <div
        style={{
          border: `1px solid ${TOKENS.borderSubtle}`,
          borderRadius: 999,
          padding: '7px 12px',
          fontSize: 13,
          color: TOKENS.textMuted,
          textTransform: 'uppercase',
        }}
      >
        {humanize(scene.purpose)}
      </div>
    </div>
  </div>
);

const ScoreBar: React.FC<{
  label: string;
  value: number;
  progressValue: number;
  index: number;
}> = ({
  label,
  value,
  progressValue,
  index,
}) => {
  const local = p(
    progressValue,
    0.08 + index * 0.06,
    0.34 + index * 0.06,
  );

  return (
    <div style={{marginTop: index ? 24 : 0}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            color: TOKENS.textSecondary,
            fontSize: 18,
          }}
        >
          {label}
        </span>

        <span
          style={{
            color: TOKENS.textPrimary,
            fontFamily: TOKENS.mono,
            fontSize: 17,
          }}
        >
          {percent(value)}
        </span>
      </div>

      <div
        style={{
          marginTop: 10,
          height: 8,
          borderRadius: 999,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.07)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${value * local * 100}%`,
            borderRadius: 999,
            background:
              value > 0.85
                ? TOKENS.accent
                : 'rgba(113,150,255,0.62)',
          }}
        />
      </div>
    </div>
  );
};

const HookStoryboard: React.FC<{
  story: Story;
  progressValue: number;
}> = ({story, progressValue}) => {
  const a = p(progressValue, 0.08, 0.3);
  const b = p(progressValue, 0.18, 0.42);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: 22,
        height: '100%',
      }}
    >
      <Card
        style={{
          opacity: a,
          transform: `translateY(${move(
            a,
            42,
            0,
          )}px)`,
        }}
      >
        <SectionLabel>What changed</SectionLabel>

        <div
          style={{
            marginTop: 26,
            color: TOKENS.textPrimary,
            fontSize: 34,
            lineHeight: 1.22,
            fontWeight: 760,
          }}
        >
          {story.summary}
        </div>

        <div
          style={{
            marginTop: 38,
            padding: 22,
            borderRadius: 18,
            background: 'rgba(77,124,255,0.10)',
            border:
              '1px solid rgba(77,124,255,0.30)',
          }}
        >
          <div
            style={{
              color: TOKENS.accentBright,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
            }}
          >
            Why now
          </div>

          <div
            style={{
              marginTop: 12,
              color: TOKENS.textSecondary,
              fontSize: 22,
              lineHeight: 1.35,
            }}
          >
            {story.whyNow}
          </div>
        </div>
      </Card>

      <Card
        style={{
          background: TOKENS.surfaceStrong,
          opacity: b,
          transform: `translateX(${move(
            b,
            36,
            0,
          )}px)`,
        }}
      >
        <SectionLabel>Signal profile</SectionLabel>

        <div
          style={{
            marginTop: 30,
            fontSize: 62,
            fontWeight: 860,
            letterSpacing: -2.5,
          }}
        >
          {percent(story.aigovRelevanceScore)}
        </div>

        <div
          style={{
            marginTop: 8,
            color: TOKENS.accentBright,
            fontSize: 18,
          }}
        >
          AIGov relevance
        </div>

        <div style={{marginTop: 45}}>
          <ScoreBar
            label="Freshness"
            value={story.freshnessScore}
            progressValue={progressValue}
            index={0}
          />
          <ScoreBar
            label="Novelty"
            value={story.noveltyScore}
            progressValue={progressValue}
            index={1}
          />
          <ScoreBar
            label="Interest"
            value={story.audienceInterestScore}
            progressValue={progressValue}
            index={2}
          />
        </div>
      </Card>
    </div>
  );
};

const ContextStoryboard: React.FC<{
  story: Story;
  progressValue: number;
}> = ({story, progressValue}) => {
  const evidence = story.evidence[0];
  const rows = [
    ['1', 'Signal detected', story.title],
    [
      '2',
      'Context reconstructed',
      story.summary,
    ],
    [
      '3',
      'Why it matters',
      story.whyNow,
    ],
  ];

  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gap: 22,
      }}
    >
      <Card>
        <SectionLabel>Evidence source</SectionLabel>

        <div
          style={{
            marginTop: 22,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                color: TOKENS.textPrimary,
                fontSize: 28,
                fontWeight: 760,
                lineHeight: 1.22,
              }}
            >
              {evidence?.title ?? story.title}
            </div>

            <div
              style={{
                marginTop: 14,
                color: TOKENS.textMuted,
                fontFamily: TOKENS.mono,
                fontSize: 14,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 690,
              }}
            >
              {evidence?.url ?? 'source unavailable'}
            </div>
          </div>

          <div
            style={{
              alignSelf: 'start',
              padding: '8px 12px',
              borderRadius: 999,
              border: `1px solid ${TOKENS.border}`,
              color: TOKENS.textSecondary,
              fontSize: 13,
              textTransform: 'uppercase',
            }}
          >
            {evidence?.evidenceType ?? 'evidence'}
          </div>
        </div>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '78px 1fr',
          gap: 18,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 38,
            bottom: 38,
            width: 2,
            background: TOKENS.borderSubtle,
          }}
        />

        {rows.map(([index, label, text], i) => {
          const local = p(
            progressValue,
            0.06 + i * 0.10,
            0.30 + i * 0.10,
          );

          return (
            <React.Fragment key={index}>
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: 999,
                  border: `2px solid ${TOKENS.accentBright}`,
                  background: TOKENS.surfaceStrong,
                  color: TOKENS.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: TOKENS.mono,
                  fontSize: 18,
                  zIndex: 2,
                  opacity: local,
                  transform: `scale(${move(
                    local,
                    0.7,
                    1,
                  )})`,
                }}
              >
                0{index}
              </div>

              <Card
                style={{
                  opacity: local,
                  transform: `translateX(${move(
                    local,
                    35,
                    0,
                  )}px)`,
                }}
              >
                <SectionLabel>{label}</SectionLabel>

                <div
                  style={{
                    marginTop: 15,
                    color: TOKENS.textSecondary,
                    fontSize: 21,
                    lineHeight: 1.34,
                  }}
                >
                  {text}
                </div>
              </Card>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const EvidenceStoryboard: React.FC<{
  story: Story;
  progressValue: number;
}> = ({story, progressValue}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '0.95fr 1.05fr',
      gap: 22,
      height: '100%',
    }}
  >
    <Card>
      <SectionLabel>Signal quality</SectionLabel>

      <div style={{marginTop: 32}}>
        <ScoreBar
          label="Freshness"
          value={story.freshnessScore}
          progressValue={progressValue}
          index={0}
        />
        <ScoreBar
          label="Novelty"
          value={story.noveltyScore}
          progressValue={progressValue}
          index={1}
        />
        <ScoreBar
          label="Audience interest"
          value={story.audienceInterestScore}
          progressValue={progressValue}
          index={2}
        />
        <ScoreBar
          label="Governance relevance"
          value={story.aigovRelevanceScore}
          progressValue={progressValue}
          index={3}
        />
      </div>
    </Card>

    <Card
      style={{
        background: TOKENS.surfaceStrong,
      }}
    >
      <SectionLabel>Interpretation</SectionLabel>

      <div
        style={{
          marginTop: 28,
          color: TOKENS.textPrimary,
          fontSize: 31,
          lineHeight: 1.23,
          fontWeight: 760,
        }}
      >
        {story.storyAngle}
      </div>

      <div
        style={{
          marginTop: 36,
          paddingTop: 28,
          borderTop: `1px solid ${TOKENS.border}`,
        }}
      >
        <div
          style={{
            color: TOKENS.textMuted,
            fontSize: 15,
            textTransform: 'uppercase',
            letterSpacing: 1.4,
          }}
        >
          Evidence count
        </div>

        <div
          style={{
            marginTop: 10,
            color: TOKENS.textPrimary,
            fontSize: 52,
            fontWeight: 860,
          }}
        >
          {story.evidence.length}
        </div>

        <div
          style={{
            marginTop: 28,
            color: TOKENS.textSecondary,
            fontSize: 20,
            lineHeight: 1.34,
          }}
        >
          A strong signal is not just a headline.
          It needs source, context and a traceable
          interpretation.
        </div>
      </div>
    </Card>
  </div>
);

const ImplicationStoryboard: React.FC<{
  story: Story;
  progressValue: number;
}> = ({story, progressValue}) => {
  const items = [
    ['Model approval', 'known'],
    ['Runtime reasoning', 'new boundary'],
    ['Agent delegation', 'new boundary'],
    ['Tool execution', 'new boundary'],
    ['Decision evidence', 'required'],
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '0.92fr 1.08fr',
        gap: 22,
        height: '100%',
      }}
    >
      <Card>
        <SectionLabel>Old governance boundary</SectionLabel>

        <div
          style={{
            marginTop: 34,
            fontSize: 31,
            lineHeight: 1.22,
            color: TOKENS.textPrimary,
            fontWeight: 760,
          }}
        >
          Approve the model.
        </div>

        <div
          style={{
            marginTop: 18,
            color: TOKENS.textMuted,
            fontSize: 20,
            lineHeight: 1.4,
          }}
        >
          Traditional controls often stop before
          autonomous execution begins.
        </div>

        <div
          style={{
            marginTop: 50,
            height: 2,
            background: TOKENS.border,
          }}
        />

        <div
          style={{
            marginTop: 35,
            fontFamily: TOKENS.mono,
            fontSize: 16,
            color: TOKENS.success,
          }}
        >
          MODEL_APPROVAL = recorded
        </div>
      </Card>

      <Card
        style={{
          background: TOKENS.surfaceStrong,
        }}
      >
        <SectionLabel>Runtime boundary</SectionLabel>

        <div style={{marginTop: 25}}>
          {items.map(([label, state], index) => {
            const local = p(
              progressValue,
              0.06 + index * 0.07,
              0.28 + index * 0.07,
            );

            return (
              <div
                key={label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 15,
                  padding: '18px 18px',
                  marginBottom: 13,
                  borderRadius: 15,
                  background:
                    index === 0
                      ? 'rgba(132,214,162,0.07)'
                      : 'rgba(77,124,255,0.08)',
                  border: `1px solid ${
                    index === 0
                      ? 'rgba(132,214,162,0.24)'
                      : 'rgba(77,124,255,0.22)'
                  }`,
                  opacity: local,
                  transform: `translateX(${move(
                    local,
                    30,
                    0,
                  )}px)`,
                }}
              >
                <span
                  style={{
                    fontSize: 19,
                    color: TOKENS.textSecondary,
                  }}
                >
                  {label}
                </span>

                <span
                  style={{
                    color:
                      index === 0
                        ? TOKENS.success
                        : TOKENS.accentBright,
                    fontFamily: TOKENS.mono,
                    fontSize: 14,
                  }}
                >
                  {state}
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 24,
            color: TOKENS.textPrimary,
            fontSize: 22,
            lineHeight: 1.36,
            fontWeight: 650,
          }}
        >
          {story.storyAngle}
        </div>
      </Card>
    </div>
  );
};

const ConnectionStoryboard: React.FC<{
  story: Story;
  progressValue: number;
}> = ({story, progressValue}) => {
  const controls = [
    'Capture runtime context',
    'Record agent actions',
    'Bind evidence to decisions',
    'Evaluate policy continuously',
    'Preserve approval boundaries',
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 22,
        height: '100%',
      }}
    >
      <Card>
        <SectionLabel>Control stack</SectionLabel>

        <div style={{marginTop: 26}}>
          {controls.map((control, index) => {
            const local = p(
              progressValue,
              0.04 + index * 0.07,
              0.27 + index * 0.07,
            );

            return (
              <div
                key={control}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 17,
                  padding: '17px 18px',
                  borderRadius: 14,
                  background:
                    'rgba(255,255,255,0.025)',
                  border: `1px solid ${TOKENS.borderSubtle}`,
                  opacity: local,
                  transform: `translateY(${move(
                    local,
                    22,
                    0,
                  )}px)`,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    background: TOKENS.accent,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  ✓
                </div>

                <span
                  style={{
                    color: TOKENS.textSecondary,
                    fontSize: 19,
                  }}
                >
                  {control}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card
        style={{
          background:
            'linear-gradient(180deg, rgba(77,124,255,0.12), rgba(21,28,40,1))',
        }}
      >
        <SectionLabel>Takeaway</SectionLabel>

        <div
          style={{
            marginTop: 32,
            fontSize: 42,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            fontWeight: 840,
            color: TOKENS.textPrimary,
          }}
        >
          The governance boundary is moving with
          the technology.
        </div>

        <div
          style={{
            marginTop: 36,
            height: 3,
            width: 90,
            borderRadius: 999,
            background: TOKENS.accent,
          }}
        />

        <div
          style={{
            marginTop: 34,
            color: TOKENS.textSecondary,
            fontSize: 22,
            lineHeight: 1.38,
          }}
        >
          {story.whyNow}
        </div>

        <div
          style={{
            marginTop: 50,
            color: TOKENS.textMuted,
            fontFamily: TOKENS.mono,
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          evidence → context → policy → decision
        </div>
      </Card>
    </div>
  );
};

const Storyboard: React.FC<{
  story: Story;
  scene: SceneBeat;
  progressValue: number;
}> = ({story, scene, progressValue}) => {
  switch (scene.purpose) {
    case 'hook':
      return (
        <HookStoryboard
          story={story}
          progressValue={progressValue}
        />
      );

    case 'context':
      return (
        <ContextStoryboard
          story={story}
          progressValue={progressValue}
        />
      );

    case 'evidence':
      return (
        <EvidenceStoryboard
          story={story}
          progressValue={progressValue}
        />
      );

    case 'implication':
      return (
        <ImplicationStoryboard
          story={story}
          progressValue={progressValue}
        />
      );

    case 'aigov_connection':
      return (
        <ConnectionStoryboard
          story={story}
          progressValue={progressValue}
        />
      );

    default:
      return (
        <EvidenceStoryboard
          story={story}
          progressValue={progressValue}
        />
      );
  }
};

const Scene: React.FC<{
  scene: SceneBeat;
  story: Story;
  sceneFrames: number;
}> = ({
  scene,
  story,
  sceneFrames,
}) => {
  const frame = useCurrentFrame();

  const sceneP = p(
    frame,
    0,
    sceneFrames,
  );

  const enter = p(sceneP, 0, 0.12);

  const exit = interpolate(
    sceneP,
    [0.9, 1],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  );

  const hook = scene.purpose === 'hook';

  return (
    <AbsoluteFill
      style={{
        background: TOKENS.bg,
        color: TOKENS.textPrimary,
        fontFamily: TOKENS.font,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(
              circle at ${20 + sceneP * 32}% 12%,
              rgba(77,124,255,0.13),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              rgba(255,255,255,0.015),
              transparent 35%
            )
          `,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 58,
          right: 58,
          zIndex: 5,
        }}
      >
        <Header
          story={story}
          scene={scene}
          enter={enter}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 170,
          left: 58,
          right: 58,
          opacity: enter * exit,
          transform: `translateX(${move(
            enter,
            -26,
            0,
          )}px)`,
        }}
      >
        <div
          style={{
            fontSize: headlineSize(
              scene.headline,
              hook,
            ),
            lineHeight: hook ? 0.98 : 1.02,
            fontWeight: 860,
            letterSpacing: hook ? -3.2 : -2.4,
            maxWidth: 960,
          }}
        >
          {scene.headline}
        </div>

        {scene.body ? (
          <div
            style={{
              marginTop: 22,
              maxWidth: 930,
              color: TOKENS.textSecondary,
              fontSize: 24,
              lineHeight: 1.36,
            }}
          >
            {scene.body}
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: 'absolute',
          top: hook ? 470 : 500,
          left: 58,
          right: 58,
          bottom: 82,
          opacity: exit,
        }}
      >
        <Storyboard
          story={story}
          scene={scene}
          progressValue={sceneP}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 58,
          right: 58,
          bottom: 34,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 3,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${sceneP * 100}%`,
              background: TOKENS.accent,
            }}
          />
        </div>

        <div
          style={{
            color: TOKENS.textMuted,
            fontFamily: TOKENS.mono,
            fontSize: 12,
            letterSpacing: 1,
          }}
        >
          AIGOV
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AIGovSocialVideo: React.FC<
  RenderBrief
> = (brief) => {
  const {fps} = useVideoConfig();

  let cursor = 0;

  return (
    <AbsoluteFill
      style={{
        background: TOKENS.bg,
      }}
    >
      {brief.creative.scenes.map((scene) => {
        const durationInFrames = Math.max(
          1,
          Math.round(
            scene.durationSeconds * fps,
          ),
        );

        const from = cursor;
        cursor += durationInFrames;

        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={durationInFrames}
          >
            <Scene
              scene={scene}
              story={brief.story}
              sceneFrames={durationInFrames}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {HookScene} from '../scenes/HookScene';
import {MobilePromptScene} from '../scenes/MobilePromptScene';
import {ValidationScene} from '../scenes/ValidationScene';
import {DecisionScene} from '../scenes/DecisionScene';
import {EvidenceScene} from '../scenes/EvidenceScene';
import {OutroScene} from '../scenes/OutroScene';
import {GridBackground} from '../components/GridBackground';

export type GovAIVideoProps = {
  hookLines: string[];
  mobilePrompt: string;
  checks: string[];
  decision: {
    status: 'approved' | 'blocked';
    title: string;
    reason: string;
  };
  evidenceItems: string[];
  outro: {
    headline: string;
    subheadline: string;
  };
};

export const theme = {
  bg: '#030B1D',
  bg2: '#08162E',
  panel: 'rgba(25, 38, 72, 0.72)',
  panelStrong: 'rgba(29, 45, 84, 0.84)',
  border: 'rgba(152, 176, 255, 0.18)',
  borderStrong: 'rgba(152, 176, 255, 0.28)',
  text: '#F3F7FF',
  textSoft: 'rgba(243, 247, 255, 0.72)',
  textDim: 'rgba(243, 247, 255, 0.54)',
  accent: '#7AA2FF',
  accentSoft: 'rgba(122, 162, 255, 0.18)',
  glow: 'rgba(81, 118, 255, 0.22)',
};

export const GovAIHeroVideo: React.FC<GovAIVideoProps> = (props) => {
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at 50% 8%, rgba(58, 93, 214, 0.28), transparent 34%),
          radial-gradient(circle at 50% 24%, rgba(32, 57, 130, 0.24), transparent 48%),
          linear-gradient(180deg, ${theme.bg2} 0%, ${theme.bg} 68%, #020611 100%)
        `,
        color: theme.text,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <GridBackground />
      <Audio src={staticFile('voiceover.mp3')} />

      <Sequence from={0} durationInFrames={140}>
        <HookScene lines={props.hookLines} />
      </Sequence>

      <Sequence from={140} durationInFrames={150}>
        <MobilePromptScene prompt={props.mobilePrompt} />
      </Sequence>

      <Sequence from={290} durationInFrames={200}>
        <ValidationScene checks={props.checks} />
      </Sequence>

      <Sequence from={490} durationInFrames={140}>
        <DecisionScene decision={props.decision} />
      </Sequence>

      <Sequence from={630} durationInFrames={170}>
        <EvidenceScene items={props.evidenceItems} />
      </Sequence>

      <Sequence from={800} durationInFrames={100}>
        <OutroScene outro={props.outro} />
      </Sequence>
    </AbsoluteFill>
  );
};
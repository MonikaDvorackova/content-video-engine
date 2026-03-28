Content Video Engine

A video generation project for producing polished product and brand videos with Remotion.

This repository currently contains a GovAI hero video pipeline built in React and Remotion. It is designed to support visually strong, modern motion content that can be rendered locally and iterated on as a proper engineering project rather than as an ad hoc video experiment.

What this project does

The project renders a structured promotional video composition from code. It combines:
scene based video composition
reusable React components
structured JSON driven content
optional audio assets
deterministic local rendering

The current implementation includes a GovAI hero video composed of multiple scenes such as hook, validation, evidence, decision logic, mobile prompt flow, and outro.

Tech stack

Remotion
React
TypeScript
Node.js

Project structure

src/
Root.tsx
index.ts
components/
compositions/
scenes/
data/
public/
voiceover.mp3

Main files

src/Root.tsx defines the Remotion composition
src/compositions/GovAIHeroVideo.tsx contains the main video composition
src/scenes/ contains individual visual scenes
src/components/ contains reusable visual elements
src/data/govai-release-gate.json stores structured content for the video
public/voiceover.mp3 contains the voiceover asset if used

Getting started

Install dependencies:
npm install
Start the Remotion preview:
npm run dev
Render the video:
npm run render

Notes

Build outputs and generated files should not be committed. The repository is intended to track source code, configuration, structured content, and project assets that are part of the actual production pipeline.
Typical generated folders such as out/, dist/, build/, and dependency folders such as node_modules/ should remain ignored.

Current status

This repository contains the initial version of the video engine and the first GovAI hero video implementation. Future work may include:
improved audio synchronization
better scene timing and transitions
reusable branding themes
support for additional video formats and variants
automated content driven rendering workflows

License

Private or proprietary unless stated otherwise.
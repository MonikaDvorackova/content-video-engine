import fs from "fs";
import path from "path";
import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Target: ~96s total deck (12 slides × 8s). Keep calm, technical, infra-focused.
export const script = `
GovAI is AI governance enforcement infrastructure. It blocks AI releases and runtime decisions unless they are evidenced, approved, traceable, and policy compliant.
Enterprises ship AI faster than governance can keep up. Evidence lives across eval reports, lineage systems, and approvals, and it is rarely bound to the artifact that ships. So a validated model does not guarantee a valid deployed decision.
Today’s governance is mostly declarative. Observability detects but does not block. GRC documents controls but does not execute them in CI. Eval platforms validate models, not full decision systems in production.
GovAI makes governance executable with a deterministic gate. Inputs are the artifact hash, an evidence bundle, scoped approvals, and the applicable policy. The output is allow or deny, with reason codes. On allow, GovAI produces a signed decision package bound to the promoted artifact.
In CI, a pull request changes a model, prompt, or routing policy. GovAI assembles evidence, evaluates the contract, and fails closed when required proof is missing. Attach the missing approval, re evaluate, sign, and promotion is allowed.
For regulated enterprises operationalizing the AI Act, this is continuous control execution: traceability, oversight, and change control on every promotion.
Roadmap: promotion enforcement today, runtime decision gating next, then a control plane for policies and evidence contracts.
We have a CI gate implemented, signed decision packages, audit export primitives, and a NeurIPS 2026 submission with design partner conversations underway.
`;

async function main() {
  const outputPath = path.resolve("public/audio/govai-investor-deck-voiceover.mp3");

  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: script.trim(),
    instructions:
      "Calm, technical, investor-ready enterprise infrastructure narration. Speak clearly, slightly faster than a typical demo voice. Keep only brief pauses at paragraph breaks. No hype.",
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.writeFileSync(outputPath, buffer);
  console.log("Investor deck voiceover generated at:", outputPath);
}

main();


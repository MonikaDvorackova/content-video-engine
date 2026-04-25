import fs from "fs";
import path from "path";
import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT: Use this EXACT text (per repo instructions).
const script = `
GovAI turns AI lifecycle events into a verifiable compliance trail.
It creates an audit-ready run record from production evidence.

The proof problem is operational: can you prove what happened, when it happened, and who authorized promotion.
GovAI answers this with a deterministic chain of evidence.

Each incoming event is ingested as an evidence packet.
GovAI expands the payload into explicit fields and normalizes values.
It computes a fingerprint and hash, then commits the packet into an append-only chain.
Run state gates update as commits complete.

Data: register dataset version, system identifier, and dataset fingerprint.
Training: link training job to that fingerprint and the produced model artifact.
Evaluation: commit report identifiers and key metrics as structured values.
Approval: record approver identity and an approval reference as evidence.
Promotion: commit the promoted artifact, target environment, and promotion reference.

From the committed chain, GovAI derives compliance state from satisfied requirements.
When all required evidence and approvals are present, the state is VALID.

GovAI verifies integrity by recomputing hash links and comparing fingerprints end-to-end.
Only after verification completes does CHAIN_VALID resolve to true.

GovAI provides audit-ready AI governance: structured evidence, deterministic gates, and a verifiable chain.
`;

async function main() {
  const outputPath = path.resolve("public/audio/govai-demo-voiceover.mp3");

  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: script,
    instructions:
      "Speak slowly and deliberately in a calm professional product-demo voice. Leave natural pauses between sections.",
  });

  const buffer = Buffer.from(await response.arrayBuffer());

  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.writeFileSync(outputPath, buffer);

  console.log("GovAIDemo voiceover generated at:", outputPath);
}

main();


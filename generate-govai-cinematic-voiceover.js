import fs from "fs";
import path from "path";
import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const script = `
Autonomous systems no longer execute as single models.
They reason, delegate, orchestrate, and coordinate across distributed execution paths.
Complexity has crossed beyond human observability.

Traditional governance was built for logs and dashboards.
Logs are not evidence.

Observability is not accountability.

Explainability is not reconstructibility.

These structures were sufficient for earlier systems.
They are structurally obsolete for agentic execution.

Auditability is reconstructibility.
Execution chains align.
Evidence attaches to every action.
Signed lineage, deterministic replay, policy evaluation at runtime.
A system becomes governable when it becomes reconstructible.

Governance belongs in the execution graph.
Policy gates intercept actions.
Approval checkpoints bind human intervention.
Runtime constraints enforce delegation boundaries.
Governance is infrastructure—not monitoring.

Every action attributable.
Every delegation traceable.
Every decision reconstructible.
Across multi-agent orchestration, accountability propagates with evidence.

GovAI is the evidentiary layer for accountable AI systems.
Enterprise orchestration with governed execution.
Evidence bound to every layer of runtime.

Institutional systems require governed autonomous execution.
Financial networks, healthcare orchestration, critical infrastructure, government coordination—
connected through accountable AI runtime.

GovAI.
Evidentiary AI Governance.
Accountability for Agentic Systems.
`;

async function main() {
  const outputPath = path.resolve("public/audio/govai-cinematic-voiceover.mp3");

  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: script,
    instructions:
      "Speak slowly and deliberately in a calm institutional documentary voice. Use long natural pauses between sections and before key statements. Do not sound promotional or energetic. Let silence breathe.",
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.writeFileSync(outputPath, buffer);

  console.log("GovAI cinematic voiceover generated at:", outputPath);
}

main();

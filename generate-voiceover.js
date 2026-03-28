import fs from "fs";
import path from "path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const script = `
Most AI systems can show what is deployed.

Very few can prove why it was allowed to run.

GovAI generates auditable evidence for model releases, integrity checks, and compliance workflows.

Every run, every status, every hash, and every artifact stays traceable.

Minimal surface. Strong guarantees.

GovAI.
`;

async function main() {
  const outputPath = path.resolve("public/voiceover.mp3");

  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: script,
  });

  const buffer = Buffer.from(await response.arrayBuffer());

  fs.mkdirSync("public", { recursive: true });
  fs.writeFileSync(outputPath, buffer);

  console.log("Voiceover generated at:", outputPath);
}

main();
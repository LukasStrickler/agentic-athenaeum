import { writeFileSync } from "node:fs";
import { loadEnv, normalizeInputText } from "@agentic-athenaeum/contracts";

loadEnv();

const args = process.argv.slice(2);
let input = "No input provided";
let output = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" && args[i + 1]) {
    input = args[i + 1];
    i++;
  } else if (args[i] === "--output" && args[i + 1]) {
    output = args[i + 1];
    i++;
  }
}

const content = `# Placeholder Two Output

Input: ${normalizeInputText(input)}
`;

if (output) {
  writeFileSync(output, content);
  console.log(`[placeholder-two] Wrote to ${output}`);
} else {
  console.log(content);
}

process.exit(0);

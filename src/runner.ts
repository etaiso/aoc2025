import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface Solution {
  part1: (input: string) => unknown;
  part2: (input: string) => unknown;
}

async function run() {
  const args = process.argv.slice(2);
  const useExample = args.includes("-e") || args.includes("--example");
  const filteredArgs = args.filter((a) => a !== "-e" && a !== "--example");

  const day = filteredArgs[0];
  const part = filteredArgs[1];

  if (!day) {
    console.log("\n🎄 Advent of Code 2025 🎄\n");
    console.log("Usage:");
    console.log("  npm run solve <day>        Run both parts for a day");
    console.log("  npm run solve <day> 1      Run only part 1");
    console.log("  npm run solve <day> 2      Run only part 2");
    console.log("  npm run example <day>      Run with example.txt");
    console.log("  npm run new <day>          Create new day from template");
    console.log("\nExamples:");
    console.log("  npm run solve 1");
    console.log("  npm run solve 1 2");
    console.log("  npm run example 1          # test with example input");
    console.log("  npm run example 1 1        # part 1 with example input");
    process.exit(0);
  }

  const dayNum = day.padStart(2, "0");
  const dayDir = join(__dirname, "days", `day${dayNum}`);
  const solutionPath = join(dayDir, "solution.ts");
  const inputFile = useExample ? "example.txt" : "input.txt";
  const inputPath = join(dayDir, inputFile);

  if (!existsSync(solutionPath)) {
    console.error(`❌ Day ${day} solution not found at ${solutionPath}`);
    console.log(`\n💡 Run: npm run new ${day}`);
    process.exit(1);
  }

  if (!existsSync(inputPath)) {
    console.error(`❌ ${inputFile} not found at ${inputPath}`);
    if (useExample) {
      console.log(`\n💡 Add example input to: ${inputPath}`);
    } else {
      console.log(`\n💡 Add your puzzle input to: ${inputPath}`);
    }
    process.exit(1);
  }

  const input = readFileSync(inputPath, "utf-8").trimEnd();
  const solution: Solution = await import(solutionPath);

  const modeLabel = useExample ? " (example)" : "";
  console.log(`\n🎄 Day ${day}${modeLabel} 🎄\n`);

  const runPart = (partNum: 1 | 2) => {
    const fn = partNum === 1 ? solution.part1 : solution.part2;
    const label = `Part ${partNum}`;

    console.log(`⏱️  ${label}...`);
    const start = performance.now();
    const result = fn(input);
    const elapsed = (performance.now() - start).toFixed(2);

    console.log(`✨ ${label}: ${result}`);
    console.log(`   (${elapsed}ms)\n`);
  };

  if (!part || part === "1") runPart(1);
  if (!part || part === "2") runPart(2);
}

run().catch(console.error);


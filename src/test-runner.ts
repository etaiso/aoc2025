import { readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { TestCase, Solution } from "./types";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ANSI colors
const colors = {
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

interface TestResult {
  passed: boolean;
  name: string;
  part: 1 | 2;
  expected: unknown;
  actual: unknown;
  time: number;
}

async function runTestsForDay(dayNum: string, partFilter?: 1 | 2): Promise<TestResult[]> {
  const dayDir = join(__dirname, "days", `day${dayNum}`);
  const solutionPath = join(dayDir, "solution.ts");
  const testsPath = join(dayDir, "tests.ts");

  if (!existsSync(solutionPath)) {
    console.log(colors.red(`❌ Day ${dayNum} solution not found`));
    return [];
  }

  if (!existsSync(testsPath)) {
    console.log(colors.yellow(`⚠️  Day ${dayNum} has no tests.ts`));
    return [];
  }

  const solution: Solution = await import(solutionPath);
  const { tests }: { tests: TestCase[] } = await import(testsPath);

  if (!tests || tests.length === 0) {
    console.log(colors.yellow(`⚠️  Day ${dayNum} has no test cases defined`));
    return [];
  }

  // Filter tests by part if specified
  const filteredTests = partFilter
    ? tests.filter((t) => t.part === partFilter)
    : tests;

  if (filteredTests.length === 0) {
    console.log(colors.yellow(`⚠️  Day ${dayNum} has no tests for part ${partFilter}`));
    return [];
  }

  const results: TestResult[] = [];

  for (let i = 0; i < filteredTests.length; i++) {
    const test = filteredTests[i];
    const testName = test.name || `Test ${i + 1}`;
    const fn = test.part === 1 ? solution.part1 : solution.part2;
    const input = Array.isArray(test.input) ? test.input.join('\n') : test.input;

    const start = performance.now();
    const actual = fn(input.trimEnd());
    const time = performance.now() - start;

    const passed = actual === test.expected;

    results.push({
      passed,
      name: testName,
      part: test.part,
      expected: test.expected,
      actual,
      time,
    });
  }

  return results;
}

function printResults(day: string, results: TestResult[]) {
  console.log(`\n${colors.bold(`Day ${day}`)}`);

  for (const result of results) {
    const status = result.passed ? colors.green("✓") : colors.red("✗");
    const timeStr = colors.dim(`(${result.time.toFixed(2)}ms)`);
    const partLabel = colors.dim(`[Part ${result.part}]`);

    console.log(`  ${status} ${partLabel} ${result.name} ${timeStr}`);

    if (!result.passed) {
      console.log(colors.red(`      Expected: ${result.expected}`));
      console.log(colors.red(`      Actual:   ${result.actual}`));
    }
  }
}

async function run() {
  const args = process.argv.slice(2);
  const runAll = args.includes("--all") || args.includes("-a");
  const positionalArgs = args.filter((a) => !a.startsWith("-"));
  const day = positionalArgs[0];
  const part = positionalArgs[1] as "1" | "2" | undefined;
  const partFilter = part === "1" ? 1 : part === "2" ? 2 : undefined;

  console.log("\n🧪 AoC Test Runner\n");

  let totalPassed = 0;
  let totalFailed = 0;
  const daysToRun: string[] = [];

  if (runAll) {
    // Find all days with tests
    const daysDir = join(__dirname, "days");
    if (existsSync(daysDir)) {
      const entries = readdirSync(daysDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith("day")) {
          const dayNum = entry.name.replace("day", "");
          const testsPath = join(daysDir, entry.name, "tests.ts");
          if (existsSync(testsPath)) {
            daysToRun.push(dayNum);
          }
        }
      }
      daysToRun.sort((a, b) => parseInt(a) - parseInt(b));
    }

    if (daysToRun.length === 0) {
      console.log(colors.yellow("No tests found in any day."));
      console.log(colors.dim("Add tests.ts files to your day folders."));
      process.exit(0);
    }
  } else if (day) {
    daysToRun.push(day.padStart(2, "0"));
  } else {
    console.log("Usage:");
    console.log("  npm test <day>       Run all tests for a day");
    console.log("  npm test <day> 1     Run only part 1 tests");
    console.log("  npm test <day> 2     Run only part 2 tests");
    console.log("  npm test:all         Run tests for all days");
    console.log("\nExamples:");
    console.log("  npm test 1");
    console.log("  npm test 1 1");
    console.log("  npm test:all");
    process.exit(0);
  }

  for (const dayNum of daysToRun) {
    const results = await runTestsForDay(dayNum, partFilter);
    if (results.length > 0) {
      printResults(dayNum, results);
      totalPassed += results.filter((r) => r.passed).length;
      totalFailed += results.filter((r) => !r.passed).length;
    }
  }

  // Summary
  console.log("\n" + "─".repeat(40));
  const total = totalPassed + totalFailed;
  if (total > 0) {
    const summary = totalFailed === 0
      ? colors.green(`✓ ${totalPassed}/${total} tests passed`)
      : colors.red(`✗ ${totalFailed}/${total} tests failed`);
    console.log(summary);
  }
  console.log();

  process.exit(totalFailed > 0 ? 1 : 0);
}

run().catch(console.error);


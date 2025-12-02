import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const day = process.argv[2];

if (!day) {
  console.error("Usage: npm run new <day>");
  process.exit(1);
}

const dayNum = day.padStart(2, "0");
const dayDir = join(__dirname, "days", `day${dayNum}`);

if (existsSync(dayDir)) {
  console.log(`📁 Day ${day} already exists at ${dayDir}`);
  process.exit(0);
}

mkdirSync(dayDir, { recursive: true });

const solutionTemplate = `// Advent of Code 2025 - Day ${day}
// https://adventofcode.com/2025/day/${day}

export function part1(input: string): number {
  const lines = input.split("\\n");
  
  // TODO: Implement part 1
  return 0;
}

export function part2(input: string): number {
  const lines = input.split("\\n");
  
  // TODO: Implement part 2
  return 0;
}
`;

const testsTemplate = `import type { TestCase } from '../../types';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, 'example.txt'), 'utf-8');

export const tests: TestCase[] = [
  // Part 1 tests
  { name: 'example.txt', part: 1, input: example, expected: "{{EXPECTED_RESULT}}" },

  // Part 2 tests
  { name: 'example.txt', part: 2, input: example, expected: "{{EXPECTED_RESULT}}" },
];
`;

writeFileSync(join(dayDir, "solution.ts"), solutionTemplate);
writeFileSync(join(dayDir, "input.txt"), "");
writeFileSync(join(dayDir, "example.txt"), "");
writeFileSync(join(dayDir, "tests.ts"), testsTemplate);

console.log(`\n🎄 Created Day ${day} 🎄\n`);
console.log(`📁 ${dayDir}/`);
console.log(`   ├── solution.ts   (your solution)`);
console.log(`   ├── input.txt     (paste your puzzle input)`);
console.log(`   ├── example.txt   (test with example input)`);
console.log(`   └── tests.ts      (add test cases)\n`);
console.log(`🔗 Puzzle: https://adventofcode.com/2025/day/${day}\n`);
console.log(`Next steps:`);
console.log(`  1. Paste your input into input.txt`);
console.log(`  2. Implement part1() and part2()`);
console.log(`  3. Run: npm run solve ${day}\n`);



// Tests for Day 11: Reactor
import { part1, part2, parseGraph, countPaths, countPathsWithRequired } from "./solution";
import type { TestCase } from "../../types";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, "example.txt"), "utf-8");

// Test parsing
const testParsing = () => {
  console.log("=== Testing Parsing ===");

  const input = `aaa: you hhh
you: bbb ccc
bbb: ddd eee`;
  
  const graph = parseGraph(input);
  
  console.assert(
    JSON.stringify(graph.get("aaa")) === JSON.stringify(["you", "hhh"]),
    "aaa should have outputs [you, hhh]"
  );
  console.assert(
    JSON.stringify(graph.get("you")) === JSON.stringify(["bbb", "ccc"]),
    "you should have outputs [bbb, ccc]"
  );
  console.assert(
    JSON.stringify(graph.get("bbb")) === JSON.stringify(["ddd", "eee"]),
    "bbb should have outputs [ddd, eee]"
  );
  
  console.log("Parsing tests passed!\n");
};

// Test path counting
const testCountPaths = () => {
  console.log("=== Testing Path Counting ===");

  // Simple linear path
  const graph1 = new Map<string, string[]>([
    ["you", ["a"]],
    ["a", ["out"]],
  ]);
  console.assert(countPaths(graph1, "you", "out") === 1, "Linear path should have 1 path");

  // Two parallel paths
  const graph2 = new Map<string, string[]>([
    ["you", ["a", "b"]],
    ["a", ["out"]],
    ["b", ["out"]],
  ]);
  console.assert(countPaths(graph2, "you", "out") === 2, "Two parallel paths");

  // Branching paths that converge
  const graph3 = new Map<string, string[]>([
    ["you", ["a", "b"]],
    ["a", ["c"]],
    ["b", ["c"]],
    ["c", ["out"]],
  ]);
  console.assert(countPaths(graph3, "you", "out") === 2, "Converging paths should have 2 paths");

  console.log("Path counting tests passed!\n");
};

// Test part1 with example input
const testPart1 = () => {
  console.log("=== Testing Part 1 ===");

  const result = part1(example);
  console.log(`Part 1 result: ${result} (expected: 5)`);
  console.assert(result === 5, "Part 1 should return 5 for example input");

  console.log("Part 1 tests passed!\n");
};

// Test specific paths from the example
const testExamplePaths = () => {
  console.log("=== Testing Example Paths ===");
  
  // From the problem:
  // 1. you -> bbb -> ddd -> ggg -> out
  // 2. you -> bbb -> eee -> out
  // 3. you -> ccc -> ddd -> ggg -> out
  // 4. you -> ccc -> eee -> out
  // 5. you -> ccc -> fff -> out
  // Total: 5 paths
  
  const graph = parseGraph(example);
  
  // Verify the graph structure
  console.log("you outputs:", graph.get("you"));
  console.log("bbb outputs:", graph.get("bbb"));
  console.log("ccc outputs:", graph.get("ccc"));
  console.log("ddd outputs:", graph.get("ddd"));
  console.log("eee outputs:", graph.get("eee"));
  console.log("fff outputs:", graph.get("fff"));
  console.log("ggg outputs:", graph.get("ggg"));
  
  const result = countPaths(graph, "you", "out");
  console.assert(result === 5, `Expected 5 paths, got ${result}`);
  
  console.log("Example path tests passed!\n");
};

// Test edge cases
const testEdgeCases = () => {
  console.log("=== Testing Edge Cases ===");

  // Direct connection
  const graphDirect = new Map<string, string[]>([
    ["you", ["out"]],
  ]);
  console.assert(
    countPaths(graphDirect, "you", "out") === 1,
    "Direct connection should have 1 path"
  );

  // Multiple direct connections (shouldn't happen per problem, but good to test)
  const graphMultipleDirect = new Map<string, string[]>([
    ["you", ["out", "out"]],
  ]);
  console.assert(
    countPaths(graphMultipleDirect, "you", "out") === 2,
    "Multiple direct connections should count separately"
  );

  // Dead end branch
  const graphDeadEnd = new Map<string, string[]>([
    ["you", ["a", "b"]],
    ["a", ["out"]],
    // b has no outputs - dead end
  ]);
  console.assert(
    countPaths(graphDeadEnd, "you", "out") === 1,
    "Dead end should not count as path"
  );

  console.log("Edge case tests passed!\n");
};

// === Part 2 Tests ===

const part2Example = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

// Test counting paths with required nodes
const testCountPathsWithRequired = () => {
  console.log("=== Testing Count Paths With Required ===");

  // Simple case: path must visit 'a'
  const graph1 = new Map<string, string[]>([
    ["svr", ["a", "b"]],
    ["a", ["out"]],
    ["b", ["out"]],
  ]);
  const result1 = countPathsWithRequired(graph1, "svr", "out", ["a"]);
  console.assert(result1 === 1, `Expected 1 path through 'a', got ${result1}`);

  // Path must visit both 'a' and 'b' - impossible in parallel
  const graph2 = new Map<string, string[]>([
    ["svr", ["a", "b"]],
    ["a", ["out"]],
    ["b", ["out"]],
  ]);
  const result2 = countPathsWithRequired(graph2, "svr", "out", ["a", "b"]);
  console.assert(result2 === 0, `Expected 0 paths through both, got ${result2}`);

  // Path must visit both 'a' and 'b' - sequential
  const graph3 = new Map<string, string[]>([
    ["svr", ["a"]],
    ["a", ["b"]],
    ["b", ["out"]],
  ]);
  const result3 = countPathsWithRequired(graph3, "svr", "out", ["a", "b"]);
  console.assert(result3 === 1, `Expected 1 path through both, got ${result3}`);

  console.log("Count paths with required tests passed!\n");
};

// Test part2 with example
const testPart2 = () => {
  console.log("=== Testing Part 2 ===");

  const graph = parseGraph(part2Example);
  const result = countPathsWithRequired(graph, "svr", "out", ["dac", "fft"]);
  console.log(`Part 2 example result: ${result} (expected: 2)`);
  console.assert(result === 2, `Part 2 should return 2 for example input, got ${result}`);

  // Verify using part2 function
  const part2Result = part2(part2Example);
  console.assert(part2Result === 2, `part2() should return 2, got ${part2Result}`);

  console.log("Part 2 tests passed!\n");
};

// Test part2 edge cases
const testPart2EdgeCases = () => {
  console.log("=== Testing Part 2 Edge Cases ===");

  // Both required nodes on same path
  const input1 = `svr: dac
dac: fft
fft: out`;
  console.assert(part2(input1) === 1, "Sequential required nodes should work");

  // Required nodes in reverse order
  const input2 = `svr: fft
fft: dac
dac: out`;
  console.assert(part2(input2) === 1, "Reverse order required nodes should work");

  // Multiple paths through both
  const input3 = `svr: a b
a: dac
b: dac
dac: fft
fft: x y
x: out
y: out`;
  console.assert(part2(input3) === 4, "Multiple paths through both required: 2 to dac * 2 from fft = 4");

  console.log("Part 2 edge case tests passed!\n");
};

// Run all tests
console.log("Running Day 11 tests...\n");
testParsing();
testCountPaths();
testExamplePaths();
testPart1();
testEdgeCases();
console.log("--- Part 1 tests complete ---\n");
testCountPathsWithRequired();
testPart2();
testPart2EdgeCases();
console.log("All tests passed!");

// === Standard TestCase format for test runner ===
export const tests: TestCase[] = [
  // Part 1: Example - 5 paths from you to out
  { name: "part1 example", part: 1, input: example, expected: 5 },

  // Part 1: Direct connection
  {
    name: "part1 direct",
    part: 1,
    input: "you: out",
    expected: 1,
  },

  // Part 1: Two parallel paths
  {
    name: "part1 two paths",
    part: 1,
    input: `you: a b
a: out
b: out`,
    expected: 2,
  },

  // Part 1: Complex branching
  {
    name: "part1 complex",
    part: 1,
    input: `you: a b
a: c d
b: c d
c: out
d: out`,
    expected: 4,
  },

  // Part 2: Example - 2 paths from svr to out visiting both dac and fft
  {
    name: "part2 example",
    part: 2,
    input: part2Example,
    expected: 2,
  },

  // Part 2: Sequential required nodes
  {
    name: "part2 sequential",
    part: 2,
    input: `svr: dac
dac: fft
fft: out`,
    expected: 1,
  },

  // Part 2: Multiple paths through both
  {
    name: "part2 multiple",
    part: 2,
    input: `svr: a b
a: dac
b: dac
dac: fft
fft: x y
x: out
y: out`,
    expected: 4,
  },
];

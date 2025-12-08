// Tests for Day 8: Playground
import type { TestCase } from "../../types";
import { solve, solvePart2 } from "./solution";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, "example.txt"), "utf-8");

// === Manual tests for solve() with custom connection counts ===

// Example with 10 connections should give 40
// (One circuit of 5, one of 4, two of 2, seven of 1)
// 5 * 4 * 2 = 40
const testExampleWith10Connections = () => {
  const result = solve(example, 10);
  if (result !== 40) {
    throw new Error(`Example with 10 connections: expected 40, got ${result}`);
  }
  console.log("✓ Example with 10 connections = 40");
};

// Three points in a triangle - connect 2 pairs, get one circuit of 3
// Top 3: [3, 1, 1] but we only have 3 points, so it's [3]
// product([3]) = 3
const testThreePoints = () => {
  const input = `0,0,0
1,0,0
0,1,0`;
  const result = solve(input, 2);
  if (result !== 3) {
    throw new Error(`Three points with 2 connections: expected 3, got ${result}`);
  }
  console.log("✓ Three points with 2 connections = 3");
};

// Four points in a square - connect 3 pairs to form one circuit
// With 3 connections: all 4 connected -> [4], product = 4
const testFourPointsConnected = () => {
  const input = `0,0,0
1,0,0
1,1,0
0,1,0`;
  const result = solve(input, 3);
  if (result !== 4) {
    throw new Error(`Four points with 3 connections: expected 4, got ${result}`);
  }
  console.log("✓ Four points with 3 connections = 4");
};

// Four points - connect only 1 pair
// Result: one circuit of 2, two circuits of 1
// Top 3: [2, 1, 1], product = 2
const testFourPointsPartial = () => {
  const input = `0,0,0
1,0,0
100,100,100
101,100,100`;
  const result = solve(input, 1);
  if (result !== 2) {
    throw new Error(`Four points with 1 connection: expected 2, got ${result}`);
  }
  console.log("✓ Four points with 1 connection = 2");
};

// Six points - connect 2 closest pairs
// Two pairs far apart, each pair forms a circuit of 2
// Result: two circuits of 2, two circuits of 1
// Top 3: [2, 2, 1], product = 4
const testTwoPairs = () => {
  const input = `0,0,0
1,0,0
1000,0,0
1001,0,0
2000,0,0
3000,0,0`;
  const result = solve(input, 2);
  if (result !== 4) {
    throw new Error(`Six points with 2 connections: expected 4, got ${result}`);
  }
  console.log("✓ Six points with 2 connections = 4");
};

// === Part 2 manual tests ===

// Two points only - first connection is also the last
// X coords: 5 and 7 -> 5 * 7 = 35
const testPart2TwoPoints = () => {
  const input = `5,0,0
7,0,0`;
  const result = solvePart2(input);
  if (result !== 35) {
    throw new Error(`Part 2 two points: expected 35, got ${result}`);
  }
  console.log("✓ Part 2 two points = 35");
};

// Three points in a line: 0,0,0 -> 1,0,0 -> 10,0,0
// First connect 0-1, then 1-10 to join all
// Last connection is between points with X=1 and X=10 -> 1 * 10 = 10
const testPart2ThreePoints = () => {
  const input = `0,0,0
1,0,0
10,0,0`;
  const result = solvePart2(input);
  if (result !== 10) {
    throw new Error(`Part 2 three points: expected 10, got ${result}`);
  }
  console.log("✓ Part 2 three points = 10");
};

// Four points: two close pairs far apart
// 0,0,0 and 1,0,0 close; 100,0,0 and 101,0,0 close
// First connects 0-1, then 100-101, then finally connects the two groups
// Last connection is between 1 and 100 (or 0 and 101, etc.) -> 1 * 100 = 100
const testPart2FourPoints = () => {
  const input = `0,0,0
1,0,0
100,0,0
101,0,0`;
  const result = solvePart2(input);
  if (result !== 100) {
    throw new Error(`Part 2 four points: expected 100, got ${result}`);
  }
  console.log("✓ Part 2 four points = 100");
};

// Five points in a chain: each 10 apart
// 0 -> 10 -> 20 -> 30 -> 40
// Connections by distance: 0-10, 10-20, 20-30, 30-40 (all distance 10)
// Last one to complete the chain: 30 * 40 = 1200
const testPart2FivePointsChain = () => {
  const input = `0,0,0
10,0,0
20,0,0
30,0,0
40,0,0`;
  const result = solvePart2(input);
  if (result !== 1200) {
    throw new Error(`Part 2 five points chain: expected 1200, got ${result}`);
  }
  console.log("✓ Part 2 five points chain = 1200");
};

// Three clusters that need bridging
// Cluster A: (0,0,0), (1,0,0) - distance 1
// Cluster B: (50,0,0), (51,0,0) - distance 1  
// Cluster C: (100,0,0), (101,0,0) - distance 1
// First 3 connections: within clusters (all dist 1)
// Then bridge A-B (closest is 1-50, dist 49) and B-C (closest is 51-100, dist 49)
// Last connection bridges the remaining two circuits: 51 * 100 = 5100
const testPart2ThreeClusters = () => {
  const input = `0,0,0
1,0,0
50,0,0
51,0,0
100,0,0
101,0,0`;
  const result = solvePart2(input);
  if (result !== 5100) {
    throw new Error(`Part 2 three clusters: expected 5100, got ${result}`);
  }
  console.log("✓ Part 2 three clusters = 5100");
};

// Points with zero X coordinate
// (0,0,0) and (0,10,0) -> 0 * 0 = 0
const testPart2ZeroX = () => {
  const input = `0,0,0
0,10,0`;
  const result = solvePart2(input);
  if (result !== 0) {
    throw new Error(`Part 2 zero X: expected 0, got ${result}`);
  }
  console.log("✓ Part 2 zero X = 0");
};

// 3D test - points not on a line
// (0,0,0), (3,4,0), (10,0,0)
// Distance 0 to (3,4,0) = 5
// Distance (3,4,0) to (10,0,0) = sqrt(49+16) = sqrt(65) ≈ 8.06
// Distance 0 to (10,0,0) = 10
// Order: 0-(3,4,0) first (dist 5), then (3,4,0)-(10,0,0) (dist ~8.06)
// Last connection: 3 * 10 = 30
const testPart2_3D = () => {
  const input = `0,0,0
3,4,0
10,0,0`;
  const result = solvePart2(input);
  if (result !== 30) {
    throw new Error(`Part 2 3D: expected 30, got ${result}`);
  }
  console.log("✓ Part 2 3D = 30");
};

// Larger test: 8 points in two groups
// Group 1: corners of unit cube at origin
// Group 2: single point far away at (1000,0,0)
// All cube points connect first (7 connections), then bridge to (1000,0,0)
// Closest cube point to (1000,0,0) is (1,0,0) or (1,1,0) or (1,0,1) or (1,1,1)
// All have X=1, so last connection: 1 * 1000 = 1000
const testPart2CubeAndPoint = () => {
  const input = `0,0,0
1,0,0
0,1,0
1,1,0
0,0,1
1,0,1
0,1,1
1,1,1
1000,0,0`;
  const result = solvePart2(input);
  if (result !== 1000) {
    throw new Error(`Part 2 cube and point: expected 1000, got ${result}`);
  }
  console.log("✓ Part 2 cube and point = 1000");
};

// Example from problem: last connection is 216,146,977 and 117,168,530
// 216 * 117 = 25272
const testPart2Example = () => {
  const result = solvePart2(example);
  if (result !== 25272) {
    throw new Error(`Part 2 example: expected 25272, got ${result}`);
  }
  console.log("✓ Part 2 example = 25272");
};

// Run all manual tests
testExampleWith10Connections();
testThreePoints();
testFourPointsConnected();
testFourPointsPartial();
testTwoPairs();
testPart2TwoPoints();
testPart2ThreePoints();
testPart2FourPoints();
testPart2FivePointsChain();
testPart2ThreeClusters();
testPart2ZeroX();
testPart2_3D();
testPart2CubeAndPoint();
testPart2Example();

// === Standard TestCase format for test runner ===
export const tests: TestCase[] = [
  // Part 1: Example with 1000 connections (more than possible pairs)
  // All 20 points connected into one circuit: [20], product = 20
  { name: "example (all connected)", part: 1, input: example, expected: 20 },

  // Part 2: Example - last connection is 216,146,977 and 117,168,530
  // 216 * 117 = 25272
  { name: "example", part: 2, input: example, expected: 25272 },
];

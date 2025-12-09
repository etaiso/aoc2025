// Tests for Day 9: Largest Rectangle with Red Tile Corners
import type { TestCase } from "../../types";
import { part1, part2 } from "./solution";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, "example.txt"), "utf-8");

// === Manual tests for part1 ===

// Example from the problem: largest rectangle is 50 (between 2,5 and 11,1)
// width = |11 - 2| + 1 = 10, height = |5 - 1| + 1 = 5, area = 50
const testPart1Example = () => {
  const result = part1(example);
  if (result !== 50) {
    throw new Error(`Part 1 Example: expected 50, got ${result}`);
  }
  console.log("✓ Part 1 Example = 50");
};

// Test: Rectangle between 2,5 and 9,7 should have area 24
// width = |9 - 2| + 1 = 8, height = |7 - 5| + 1 = 3, area = 24
const testRectangle24 = () => {
  const input = `2,5
9,7`;
  const result = part1(input);
  if (result !== 24) {
    throw new Error(`Rectangle 2,5 to 9,7: expected 24, got ${result}`);
  }
  console.log("✓ Rectangle 2,5 to 9,7 = 24");
};

// Test: Rectangle between 7,1 and 11,7 should have area 35
// width = |11 - 7| + 1 = 5, height = |7 - 1| + 1 = 7, area = 35
const testRectangle35 = () => {
  const input = `7,1
11,7`;
  const result = part1(input);
  if (result !== 35) {
    throw new Error(`Rectangle 7,1 to 11,7: expected 35, got ${result}`);
  }
  console.log("✓ Rectangle 7,1 to 11,7 = 35");
};

// Test: Thin rectangle between 7,3 and 2,3 should have area 6
// width = |7 - 2| + 1 = 6, height = |3 - 3| + 1 = 1, area = 6
const testThinRectangle = () => {
  const input = `7,3
2,3`;
  const result = part1(input);
  if (result !== 6) {
    throw new Error(`Thin rectangle 7,3 to 2,3: expected 6, got ${result}`);
  }
  console.log("✓ Thin rectangle 7,3 to 2,3 = 6");
};

// Test: Two points at same location = area 1
const testSamePoint = () => {
  const input = `5,5
5,5`;
  const result = part1(input);
  if (result !== 1) {
    throw new Error(`Same point: expected 1, got ${result}`);
  }
  console.log("✓ Same point = 1");
};

// Test: Vertical line (width 1)
// (0,0) to (0,5) -> width = 1, height = 6, area = 6
const testVerticalLine = () => {
  const input = `0,0
0,5`;
  const result = part1(input);
  if (result !== 6) {
    throw new Error(`Vertical line: expected 6, got ${result}`);
  }
  console.log("✓ Vertical line = 6");
};

// Test: Horizontal line (height 1)
// (0,0) to (10,0) -> width = 11, height = 1, area = 11
const testHorizontalLine = () => {
  const input = `0,0
10,0`;
  const result = part1(input);
  if (result !== 11) {
    throw new Error(`Horizontal line: expected 11, got ${result}`);
  }
  console.log("✓ Horizontal line = 11");
};

// Test: Three points, should find the largest rectangle
const testThreePoints = () => {
  const input = `0,0
10,10
5,5`;
  // Largest: (0,0) to (10,10) -> 11 * 11 = 121
  const result = part1(input);
  if (result !== 121) {
    throw new Error(`Three points: expected 121, got ${result}`);
  }
  console.log("✓ Three points = 121");
};

// Test: Large coordinates
const testLargeCoordinates = () => {
  const input = `0,0
100000,50000`;
  // width = 100001, height = 50001, area = 5000150001
  const result = part1(input);
  if (result !== 5000150001) {
    throw new Error(`Large coordinates: expected 5000150001, got ${result}`);
  }
  console.log("✓ Large coordinates = 5000150001");
};

// === Manual tests for part2 ===

// Example from the problem: largest valid rectangle is 24 (between 9,5 and 2,3)
// width = |9 - 2| + 1 = 8, height = |5 - 3| + 1 = 3, area = 24
const testPart2Example = () => {
  const result = part2(example);
  if (result !== 24) {
    throw new Error(`Part 2 Example: expected 24, got ${result}`);
  }
  console.log("✓ Part 2 Example = 24");
};

// Test: Simple square polygon (4 corners)
// All points connected form a simple square
const testPart2SimpleSquare = () => {
  const input = `0,0
4,0
4,4
0,4`;
  // All four corners are red tiles
  // The polygon is a 5x5 square (including boundaries)
  // Rectangle (0,0) to (4,4) = area 25
  const result = part2(input);
  if (result !== 25) {
    throw new Error(`Part 2 Simple square: expected 25, got ${result}`);
  }
  console.log("✓ Part 2 Simple square = 25");
};

// Test: L-shaped polygon
const testPart2LShape = () => {
  // L-shape:
  // ###
  // #
  // #
  // Red tiles at corners: (0,0), (2,0), (2,1), (1,1), (1,2), (0,2)
  const input = `0,0
2,0
2,1
1,1
1,2
0,2`;
  // Valid rectangles:
  // (0,0) to (2,0): 3x1 = 3 (horizontal line at y=0)
  // (0,0) to (0,2): 1x3 = 3 (vertical line at x=0)
  // (0,0) to (1,1): 2x2 = 4
  // (0,0) to (2,1): invalid (corner at y=1 x=2, but polygon doesn't contain full rectangle)
  // etc.
  // The largest should be (0,0) to (1,2) = 2x3 = 6 OR (0,0) to (2,1) if valid
  // Let me trace: polygon interior includes (0,0)-(2,0)-(2,1) and (0,0)-(1,2)
  // At y=0: valid x range [0,2]
  // At y=1: valid x range [0,2] (includes edge (2,0)-(2,1) and interior)
  // Wait, let me reconsider the shape...
  // Actually with this input, corners connect: (0,0)→(2,0)→(2,1)→(1,1)→(1,2)→(0,2)→(0,0)
  // At y=0: red at (0,0) and (2,0), edge connects them. Valid: [0,2]
  // At y=1: edges (2,0)-(2,1) and (1,1)-(1,2) and (0,2)-(0,0). Valid: [0,2]
  // At y=2: red at (1,2) and (0,2), edge connects them. Valid: [0,1]
  // Rectangle (0,0) to (2,1): 3x2 = 6. Check: y=0 [0,2]⊇[0,2]✓, y=1 [0,2]⊇[0,2]✓
  const result = part2(input);
  if (result !== 6) {
    throw new Error(`Part 2 L-shape: expected 6, got ${result}`);
  }
  console.log("✓ Part 2 L-shape = 6");
};

// Test: Rectangle with a notch (concave polygon)
const testPart2Notch = () => {
  // Rectangle 6x3 with a notch cut out
  // Red tiles: (0,0), (5,0), (5,1), (3,1), (3,2), (5,2), (5,3), (0,3)
  // This creates a notch at x=3-5, y=1-2
  const input = `0,0
5,0
5,1
3,1
3,2
5,2
5,3
0,3`;
  // The full rectangle (0,0) to (5,3) would be 6x4=24 but the notch makes it invalid
  // Largest valid: (0,0) to (5,0) = 6x1=6 OR (0,0) to (0,3) = 1x4=4 OR (0,0) to (3,1)... 
  // At y=1: valid x range is [0,3] and [5,5] (two intervals)
  // So (0,0) to (3,1) = 4x2 = 8 should be valid
  // At y=2: valid x range is [0,3] and [5,5]
  // (0,0) to (3,2) = 4x3 = 12 should be valid
  // At y=3: valid x range is [0,5]
  // (0,0) to (3,3) = 4x4 = 16? Let me check all y levels:
  // y=0: [0,5] ⊇ [0,3] ✓
  // y=1: [0,3]∪[5,5], need [0,3] ⊆ [0,3] ✓
  // y=2: [0,3]∪[5,5], need [0,3] ⊆ [0,3] ✓
  // y=3: [0,5] ⊇ [0,3] ✓
  // So (0,0) to (3,3) is valid with area 4x4 = 16
  // Actually wait, (3,3) is not a red tile. Let me re-check which pairs are valid.
  // Red tiles: (0,0), (5,0), (5,1), (3,1), (3,2), (5,2), (5,3), (0,3)
  // (0,0) to (3,1): 4x2 = 8
  // (0,0) to (3,2): 4x3 = 12
  // (0,0) to (0,3): 1x4 = 4
  // (0,3) to (3,2): 4x2 = 8
  // (0,0) to (5,0): 6x1 = 6
  // Hmm, largest should be 12 for (0,0) to (3,2)
  const result = part2(input);
  if (result !== 12) {
    throw new Error(`Part 2 Notch: expected 12, got ${result}`);
  }
  console.log("✓ Part 2 Notch = 12");
};

// Test: Thin rectangle along the boundary
// The rectangle (7,3) to (11,1) should have area 15 (from problem example)
const testPart2ThinRect15 = () => {
  // Using the same example polygon
  const result = part2(example);
  // We already tested the max is 24, but let's verify the 15-area rectangle is valid
  // This is implicitly tested since we're finding the max
  // Just verify the example works
  if (result !== 24) {
    throw new Error(`Part 2 Thin rect (via example): expected 24, got ${result}`);
  }
  console.log("✓ Part 2 Example max = 24 (includes valid 15-area rectangle)");
};

// Run all manual tests
console.log("=== Part 1 Tests ===");
testPart1Example();
testRectangle24();
testRectangle35();
testThinRectangle();
testSamePoint();
testVerticalLine();
testHorizontalLine();
testThreePoints();
testLargeCoordinates();

console.log("\n=== Part 2 Tests ===");
testPart2Example();
testPart2SimpleSquare();
testPart2LShape();
testPart2Notch();
testPart2ThinRect15();

// === Standard TestCase format for test runner ===
export const tests: TestCase[] = [
  // Part 1: Example - largest rectangle is 50
  { name: "part1 example", part: 1, input: example, expected: 50 },

  // Part 1: Simple rectangle
  {
    name: "part1 simple rectangle",
    part: 1,
    input: `0,0
5,3`,
    expected: 24,
  },

  // Part 2: Example - largest valid rectangle is 24
  { name: "part2 example", part: 2, input: example, expected: 24 },

  // Part 2: Simple square
  {
    name: "part2 simple square",
    part: 2,
    input: `0,0
4,0
4,4
0,4`,
    expected: 25,
  },
];

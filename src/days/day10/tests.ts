// Tests for Day 10: Factory
import {
  part1,
  part2,
  parseMachine,
  findMinPresses,
  parseJoltageMachine,
  findMinJoltagePresses,
} from "./solution";
import type { TestCase } from "../../types";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const example = readFileSync(join(__dirname, "example.txt"), "utf-8");

// Test parsing
const testParsing = () => {
  console.log("=== Testing Parsing ===");

  const line1 = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}";
  const machine1 = parseMachine(line1);
  console.log("Machine 1:", machine1);
  console.assert(
    machine1.target.join("") === "0110",
    "Target should be [0,1,1,0]"
  );
  console.assert(machine1.buttons.length === 6, "Should have 6 buttons");
  console.assert(
    JSON.stringify(machine1.buttons[0]) === JSON.stringify([3]),
    "First button should toggle index 3"
  );
  console.assert(
    JSON.stringify(machine1.buttons[1]) === JSON.stringify([1, 3]),
    "Second button should toggle indices 1,3"
  );

  const line2 = "[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}";
  const machine2 = parseMachine(line2);
  console.log("Machine 2:", machine2);
  console.assert(
    machine2.target.join("") === "00010",
    "Target should be [0,0,0,1,0]"
  );
  console.assert(machine2.buttons.length === 5, "Should have 5 buttons");

  const line3 =
    "[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}";
  const machine3 = parseMachine(line3);
  console.log("Machine 3:", machine3);
  console.assert(
    machine3.target.join("") === "011101",
    "Target should be [0,1,1,1,0,1]"
  );
  console.assert(machine3.buttons.length === 4, "Should have 4 buttons");

  console.log("Parsing tests passed!\n");
};

// Test finding minimum presses
const testFindMinPresses = () => {
  console.log("=== Testing Find Min Presses ===");

  // Machine 1: [.##.] with buttons (3) (1,3) (2) (2,3) (0,2) (0,1)
  // Target: [0,1,1,0], expected min: 2
  const machine1 = {
    target: [0, 1, 1, 0] as number[],
    buttons: [[3], [1, 3], [2], [2, 3], [0, 2], [0, 1]],
  };
  const minPresses1 = findMinPresses(machine1);
  console.log(`Machine 1 min presses: ${minPresses1} (expected: 2)`);
  console.assert(minPresses1 === 2, "Machine 1 should need 2 presses");

  // Machine 2: [...#.] with buttons (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4)
  // Target: [0,0,0,1,0], expected min: 3
  const machine2 = {
    target: [0, 0, 0, 1, 0] as number[],
    buttons: [
      [0, 2, 3, 4],
      [2, 3],
      [0, 4],
      [0, 1, 2],
      [1, 2, 3, 4],
    ],
  };
  const minPresses2 = findMinPresses(machine2);
  console.log(`Machine 2 min presses: ${minPresses2} (expected: 3)`);
  console.assert(minPresses2 === 3, "Machine 2 should need 3 presses");

  // Machine 3: [.###.#] with buttons (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2)
  // Target: [0,1,1,1,0,1], expected min: 2
  const machine3 = {
    target: [0, 1, 1, 1, 0, 1] as number[],
    buttons: [
      [0, 1, 2, 3, 4],
      [0, 3, 4],
      [0, 1, 2, 4, 5],
      [1, 2],
    ],
  };
  const minPresses3 = findMinPresses(machine3);
  console.log(`Machine 3 min presses: ${minPresses3} (expected: 2)`);
  console.assert(minPresses3 === 2, "Machine 3 should need 2 presses");

  console.log("Find min presses tests passed!\n");
};

// Test part1 with example input
const testPart1 = () => {
  console.log("=== Testing Part 1 ===");

  const exampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

  const result = part1(exampleInput);
  console.log(`Part 1 result: ${result} (expected: 7)`);
  console.assert(result === 7, "Part 1 should return 7 for example input");

  console.log("Part 1 tests passed!\n");
};

// Test edge cases
const testEdgeCases = () => {
  console.log("=== Testing Edge Cases ===");

  // Already at target (all off)
  const machineAllOff = {
    target: [0, 0, 0] as number[],
    buttons: [[0], [1], [2]],
  };
  console.log(
    `All off machine: ${findMinPresses(machineAllOff)} (expected: 0)`
  );
  console.assert(
    findMinPresses(machineAllOff) === 0,
    "Should need 0 presses if already at target"
  );

  // Single button needed
  const machineSingleButton = {
    target: [1, 0, 0] as number[],
    buttons: [[0], [1], [2]],
  };
  console.log(
    `Single button machine: ${findMinPresses(machineSingleButton)} (expected: 1)`
  );
  console.assert(
    findMinPresses(machineSingleButton) === 1,
    "Should need 1 press"
  );

  // Button toggles multiple, need to combine
  const machineCombine = {
    target: [1, 1, 0] as number[],
    buttons: [
      [0, 1],
      [0],
      [1],
    ],
  };
  console.log(
    `Combine machine: ${findMinPresses(machineCombine)} (expected: 1)`
  );
  console.assert(findMinPresses(machineCombine) === 1, "Should need 1 press");

  console.log("Edge case tests passed!\n");
};

// === Part 2 Tests ===

// Test joltage parsing
const testJoltageParsing = () => {
  console.log("=== Testing Joltage Parsing ===");

  const line1 = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}";
  const machine1 = parseJoltageMachine(line1);
  console.log("Joltage Machine 1:", machine1);
  console.assert(
    JSON.stringify(machine1.targets) === JSON.stringify([3, 5, 4, 7]),
    "Targets should be [3,5,4,7]"
  );
  console.assert(machine1.buttons.length === 6, "Should have 6 buttons");

  const line2 = "[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}";
  const machine2 = parseJoltageMachine(line2);
  console.log("Joltage Machine 2:", machine2);
  console.assert(
    JSON.stringify(machine2.targets) === JSON.stringify([7, 5, 12, 7, 2]),
    "Targets should be [7,5,12,7,2]"
  );

  console.log("Joltage parsing tests passed!\n");
};

// Test finding minimum joltage presses
const testFindMinJoltagePresses = () => {
  console.log("=== Testing Find Min Joltage Presses ===");

  // Machine 1: buttons (3) (1,3) (2) (2,3) (0,2) (0,1), targets {3,5,4,7}
  // Expected min: 10 (press (3)x1, (1,3)x3, (2,3)x3, (0,2)x1, (0,1)x2)
  const machine1 = {
    buttons: [[3], [1, 3], [2], [2, 3], [0, 2], [0, 1]],
    targets: [3, 5, 4, 7],
  };
  const minPresses1 = findMinJoltagePresses(machine1);
  console.log(`Joltage Machine 1 min presses: ${minPresses1} (expected: 10)`);
  console.assert(minPresses1 === 10, "Machine 1 should need 10 presses");

  // Machine 2: buttons (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4), targets {7,5,12,7,2}
  // Expected min: 12
  const machine2 = {
    buttons: [
      [0, 2, 3, 4],
      [2, 3],
      [0, 4],
      [0, 1, 2],
      [1, 2, 3, 4],
    ],
    targets: [7, 5, 12, 7, 2],
  };
  const minPresses2 = findMinJoltagePresses(machine2);
  console.log(`Joltage Machine 2 min presses: ${minPresses2} (expected: 12)`);
  console.assert(minPresses2 === 12, "Machine 2 should need 12 presses");

  // Machine 3: buttons (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2), targets {10,11,11,5,10,5}
  // Expected min: 11
  const machine3 = {
    buttons: [
      [0, 1, 2, 3, 4],
      [0, 3, 4],
      [0, 1, 2, 4, 5],
      [1, 2],
    ],
    targets: [10, 11, 11, 5, 10, 5],
  };
  const minPresses3 = findMinJoltagePresses(machine3);
  console.log(`Joltage Machine 3 min presses: ${minPresses3} (expected: 11)`);
  console.assert(minPresses3 === 11, "Machine 3 should need 11 presses");

  console.log("Find min joltage presses tests passed!\n");
};

// Test part2 with example input
const testPart2 = () => {
  console.log("=== Testing Part 2 ===");

  const exampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

  const result = part2(exampleInput);
  console.log(`Part 2 result: ${result} (expected: 33)`);
  console.assert(result === 33, "Part 2 should return 33 for example input");

  console.log("Part 2 tests passed!\n");
};

// Test joltage edge cases
const testJoltageEdgeCases = () => {
  console.log("=== Testing Joltage Edge Cases ===");

  // Already at target (all zeros)
  const machineAllZero = {
    buttons: [[0], [1], [2]],
    targets: [0, 0, 0],
  };
  console.log(
    `All zero machine: ${findMinJoltagePresses(machineAllZero)} (expected: 0)`
  );
  console.assert(
    findMinJoltagePresses(machineAllZero) === 0,
    "Should need 0 presses if already at target"
  );

  // Simple case: single button pressed multiple times
  const machineSingle = {
    buttons: [[0, 1]],
    targets: [5, 5],
  };
  console.log(
    `Single button x5: ${findMinJoltagePresses(machineSingle)} (expected: 5)`
  );
  console.assert(
    findMinJoltagePresses(machineSingle) === 5,
    "Should need 5 presses"
  );

  // Need to combine buttons
  const machineCombine = {
    buttons: [[0], [1], [0, 1]],
    targets: [3, 2],
  };
  // Best: press [0] once, press [0,1] twice = 3 presses (counter 0 = 1+2=3, counter 1 = 2)
  console.log(
    `Combine machine: ${findMinJoltagePresses(machineCombine)} (expected: 3)`
  );
  console.assert(
    findMinJoltagePresses(machineCombine) === 3,
    "Should need 3 presses"
  );

  console.log("Joltage edge case tests passed!\n");
};

// Run all tests
console.log("Running Day 10 tests...\n");
testParsing();
testFindMinPresses();
testPart1();
testEdgeCases();
console.log("--- Part 1 tests complete ---\n");
testJoltageParsing();
testFindMinJoltagePresses();
testPart2();
testJoltageEdgeCases();
console.log("All tests passed!");

// === Standard TestCase format for test runner ===
export const tests: TestCase[] = [
  // Part 1: Example - machines need 2 + 3 + 2 = 7 total presses
  { name: "part1 example", part: 1, input: example, expected: 7 },

  // Part 1: Single machine needing 2 presses
  {
    name: "part1 single machine",
    part: 1,
    input: "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}",
    expected: 2,
  },

  // Part 1: Machine already at target (all off)
  {
    name: "part1 no presses needed",
    part: 1,
    input: "[...] (0) (1) (2) {1,2,3}",
    expected: 0,
  },

  // Part 2: Example - machines need 10 + 12 + 11 = 33 total presses
  { name: "part2 example", part: 2, input: example, expected: 33 },

  // Part 2: Single machine needing 10 presses
  {
    name: "part2 single machine",
    part: 2,
    input: "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}",
    expected: 10,
  },

  // Part 2: Machine already at target (all zeros)
  {
    name: "part2 no presses needed",
    part: 2,
    input: "[...] (0) (1) (2) {0,0,0}",
    expected: 0,
  },
];

export interface TestCase {
  name?: string;               // Optional test name
  part: 1 | 2;                 // Which part to test
  input: string | string[];    // Test input (string or array of lines)
  expected: number | string;   // Expected result
}

export interface Solution {
  part1: (input: string) => unknown;
  part2: (input: string) => unknown;
}


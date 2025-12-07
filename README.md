# 🎄 Advent of Code 2025

TypeScript solutions for [Advent of Code 2025](https://adventofcode.com/2025/).

## Setup

```bash
npm install
```

## Usage

### Create a new day

```bash
npm run new 1
```

This creates:

```
src/days/day01/
├── solution.ts   # Your solution code
├── input.txt     # Paste your puzzle input here
├── example.txt   # Test with example input
└── tests.ts      # Add test cases here
```

The generated `tests.ts` includes default test cases pointing to `example.txt` with `"{{EXPECTED_RESULT}}"` placeholders. Replace these with the expected values from the puzzle page.

### Run a solution

```bash
# Run both parts
npm run solve 1

# Run only part 1
npm run solve 1 1

# Run only part 2
npm run solve 1 2

# Watch mode (re-runs on file changes)
npm run watch 1
```

### Run tests

```bash
# Run all tests for a specific day
npm test 1

# Run only part 1 tests
npm test 1 1

# Run only part 2 tests
npm test 1 2

# Run tests for all days
npm run test:all
```

## Utilities

Import common helpers in your solutions:

```typescript
import { nums, lines, grid, sum, gcd, lcm, neighbors4 } from '../../utils';
```

Available utilities:

- **Parsing**: `nums`, `lines`, `grid`, `numGrid`
- **Math**: `sum`, `product`, `min`, `max`, `gcd`, `lcm`, `lcmAll`
- **Helpers**: `count`, `range`, `manhattan`, `neighbors4`, `neighbors8`
- **Grid**: `transpose`, `clone`
- **Performance**: `memo`

## Testing

Each day can have a `tests.ts` file with test cases:

```typescript
import type { TestCase } from '../../types';

export const tests: TestCase[] = [
  { part: 1, input: ['line1', 'line2'], expected: 42 },
  { name: 'edge case', part: 1, input: ['R50'], expected: 1 },
  { part: 2, input: ['another', 'input'], expected: 100 },
];
```

Test cases have the following properties:

- `part`: Which part to test (`1` or `2`)
- `input`: Array of lines (or a string for file contents)
- `expected`: The expected result (number or string)
- `name`: Optional name for the test (defaults to "Test N")

Run tests:

```bash
npm test 1        # Run all tests for day 1
npm test 1 1      # Run only part 1 tests
npm test 1 2      # Run only part 2 tests
npm run test:all  # Run tests for all days
```

## Structure

```
src/
├── runner.ts          # Main CLI runner
├── test-runner.ts     # Test runner
├── scaffold.ts        # Day generator
├── types.ts           # TypeScript types
├── utils/index.ts     # Common utilities
└── days/
    ├── day01/
    │   ├── solution.ts
    │   ├── input.txt
    │   ├── example.txt
    │   └── tests.ts
    ├── day02/
    └── ...
```

## Progress Tracking

```bash
npm run star 1          # Mark both parts of day 1 as solved
npm run star 1 1        # Mark day 1 part 1 as solved
npm run star 1 2        # Mark day 1 part 2 as solved
npm run unstar 3 1      # Mark day 3 part 1 as unsolved
npm run progress        # Show current progress
```

## Progress

| Day | Part 1 | Part 2 |
| --- | ------ | ------ |
| 01  | ⭐     | ⭐     |
| 02  | ⭐     | ⭐     |
| 03  | ⭐     | ⭐     |
| 04  | ⭐     | ⭐     |
| 05  | ⭐     | ⭐     |
| 06  | ⭐     | ⭐     |
| 07  | ⬜     | ⬜     |
| 08  | ⬜     | ⬜     |
| 09  | ⬜     | ⬜     |
| 10  | ⬜     | ⬜     |
| 11  | ⬜     | ⬜     |
| 12  | ⬜     | ⬜     |

⭐ = Solved | ⬜ = Not yet solved

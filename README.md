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
└── example.txt   # Test with example input
```

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

## Utilities

Import common helpers in your solutions:

```typescript
import { nums, lines, grid, sum, gcd, lcm, neighbors4 } from "../../utils";
```

Available utilities:
- **Parsing**: `nums`, `lines`, `grid`, `numGrid`
- **Math**: `sum`, `product`, `min`, `max`, `gcd`, `lcm`, `lcmAll`
- **Helpers**: `count`, `range`, `manhattan`, `neighbors4`, `neighbors8`
- **Grid**: `transpose`, `clone`
- **Performance**: `memo`

## Structure

```
src/
├── runner.ts          # Main CLI runner
├── scaffold.ts        # Day generator
├── utils/index.ts     # Common utilities
└── days/
    ├── day01/
    │   ├── solution.ts
    │   ├── input.txt
    │   └── example.txt
    ├── day02/
    └── ...
```

## Progress

| Day | Part 1 | Part 2 |
|-----|--------|--------|
| 01  | ⬜     | ⬜     |
| 02  | ⬜     | ⬜     |
| 03  | ⬜     | ⬜     |
| 04  | ⬜     | ⬜     |
| 05  | ⬜     | ⬜     |
| 06  | ⬜     | ⬜     |
| 07  | ⬜     | ⬜     |
| 08  | ⬜     | ⬜     |
| 09  | ⬜     | ⬜     |
| 10  | ⬜     | ⬜     |
| 11  | ⬜     | ⬜     |
| 12  | ⬜     | ⬜     |

⭐ = Solved | ⬜ = Not yet solved


// Advent of Code 2025 - Day 10
// https://adventofcode.com/2025/day/10

import { lines, sum } from "../../utils";

interface Machine {
  target: number[]; // 0 = off, 1 = on
  buttons: number[][]; // each button is array of indices it toggles
}

/** Parse a single machine line */
export function parseMachine(line: string): Machine {
  // Extract indicator light diagram [.##.]
  const diagramMatch = line.match(/\[([.#]+)\]/);
  if (!diagramMatch) throw new Error(`Invalid line: ${line}`);
  const diagram = diagramMatch[1];
  const target = diagram.split("").map((c) => (c === "#" ? 1 : 0));

  // Extract all button wiring schematics (x,y,z) or (x)
  const buttonMatches = line.matchAll(/\(([0-9,]+)\)/g);
  const buttons: number[][] = [];
  for (const match of buttonMatches) {
    const indices = match[1].split(",").map(Number);
    buttons.push(indices);
  }

  return { target, buttons };
}

/** Apply a set of button presses and check if we reach target */
function applyButtons(
  numLights: number,
  buttons: number[][],
  buttonMask: number
): number[] {
  const state = new Array(numLights).fill(0);

  for (let i = 0; i < buttons.length; i++) {
    if (buttonMask & (1 << i)) {
      // Press this button
      for (const idx of buttons[i]) {
        state[idx] ^= 1; // Toggle
      }
    }
  }

  return state;
}

/** Find minimum button presses to reach target state */
export function findMinPresses(machine: Machine): number {
  const { target, buttons } = machine;
  const numLights = target.length;
  const numButtons = buttons.length;

  // Brute force all 2^n combinations
  const totalCombinations = 1 << numButtons;
  let minPresses = Infinity;

  for (let mask = 0; mask < totalCombinations; mask++) {
    const state = applyButtons(numLights, buttons, mask);

    // Check if state matches target
    let matches = true;
    for (let i = 0; i < numLights; i++) {
      if (state[i] !== target[i]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      // Count number of bits set (number of button presses)
      let presses = 0;
      let m = mask;
      while (m > 0) {
        presses += m & 1;
        m >>= 1;
      }
      minPresses = Math.min(minPresses, presses);
    }
  }

  return minPresses === Infinity ? -1 : minPresses;
}

export function part1(input: string): number {
  const machines = lines(input).map(parseMachine);
  const minPresses = machines.map(findMinPresses);
  return sum(minPresses);
}

interface JoltageMachine {
  buttons: number[][]; // each button is array of counter indices it increments
  targets: number[]; // joltage requirements for each counter
}

/** Parse a machine line for Part 2 (joltage mode) */
export function parseJoltageMachine(line: string): JoltageMachine {
  // Extract joltage requirements {x,y,z}
  const joltageMatch = line.match(/\{([0-9,]+)\}/);
  if (!joltageMatch) throw new Error(`Invalid line: ${line}`);
  const targets = joltageMatch[1].split(",").map(Number);

  // Extract all button wiring schematics (x,y,z) or (x)
  const buttonMatches = line.matchAll(/\(([0-9,]+)\)/g);
  const buttons: number[][] = [];
  for (const match of buttonMatches) {
    const indices = match[1].split(",").map(Number);
    buttons.push(indices);
  }

  return { buttons, targets };
}

/**
 * Solve the linear system using Gaussian elimination.
 * Returns the solution space: pivot columns and the reduced matrix.
 */
function gaussianElimination(
  A: number[][],
  b: number[]
): {
  rank: number;
  pivotCols: number[];
  matrix: number[][]; // Reduced row echelon form of [A|b]
} {
  const m = A.length; // rows (counters)
  const n = A[0]?.length ?? 0; // cols (buttons)

  // Create augmented matrix [A | b] using fractions (as [numerator, denominator])
  const aug: number[][] = A.map((row, i) => [...row, b[i]]);

  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < n && pivotRow < m; col++) {
    // Find pivot (first non-zero in this column at or below pivotRow)
    let maxRow = -1;
    for (let row = pivotRow; row < m; row++) {
      if (aug[row][col] !== 0) {
        maxRow = row;
        break;
      }
    }

    if (maxRow === -1) continue; // No pivot in this column

    // Swap rows
    [aug[pivotRow], aug[maxRow]] = [aug[maxRow], aug[pivotRow]];

    // Scale pivot row to make pivot = 1
    const pivotVal = aug[pivotRow][col];
    for (let c = 0; c <= n; c++) {
      aug[pivotRow][c] /= pivotVal;
    }

    // Eliminate all other rows
    for (let row = 0; row < m; row++) {
      if (row !== pivotRow && aug[row][col] !== 0) {
        const factor = aug[row][col];
        for (let c = 0; c <= n; c++) {
          aug[row][c] -= factor * aug[pivotRow][c];
        }
      }
    }

    pivotCols.push(col);
    pivotRow++;
  }

  return { rank: pivotRow, pivotCols, matrix: aug };
}

/**
 * Find minimum button presses using Gaussian elimination + search over free variables.
 */
export function findMinJoltagePresses(machine: JoltageMachine): number {
  const { buttons, targets } = machine;
  const numButtons = buttons.length;
  const numCounters = targets.length;

  // Build constraint matrix A where A[j][i] = 1 if button i affects counter j
  const A: number[][] = [];
  for (let j = 0; j < numCounters; j++) {
    A[j] = new Array(numButtons).fill(0);
    for (let i = 0; i < numButtons; i++) {
      if (buttons[i].includes(j)) {
        A[j][i] = 1;
      }
    }
  }

  // Solve the system
  const { rank, pivotCols, matrix } = gaussianElimination(A, targets);

  // Check for inconsistency (row with all zeros in A but non-zero in b)
  for (let row = rank; row < numCounters; row++) {
    if (Math.abs(matrix[row][numButtons]) > 1e-9) {
      return -1; // No solution
    }
  }

  // Identify free columns (non-pivot columns)
  const freeCols: number[] = [];
  const pivotSet = new Set(pivotCols);
  for (let i = 0; i < numButtons; i++) {
    if (!pivotSet.has(i)) {
      freeCols.push(i);
    }
  }

  // If no free variables, we have a unique solution
  if (freeCols.length === 0) {
    let total = 0;
    for (let row = 0; row < rank; row++) {
      const val = Math.round(matrix[row][numButtons]);
      if (val < 0 || Math.abs(val - matrix[row][numButtons]) > 1e-9) {
        return -1; // Not a valid non-negative integer solution
      }
      total += val;
    }
    return total;
  }

  // Search over free variables
  // For each free variable, determine its valid range
  let minPresses = Infinity;

  // Compute upper bounds for free variables based on targets
  const freeUpperBounds: number[] = freeCols.map((col) => {
    let maxVal = 0;
    for (let j = 0; j < numCounters; j++) {
      if (buttons[col].includes(j)) {
        maxVal = Math.max(maxVal, targets[j]);
      }
    }
    return maxVal;
  });

  // DFS over free variables
  function searchFreeVars(
    freeIdx: number,
    freeVals: number[],
    freeSum: number
  ): void {
    if (freeSum >= minPresses) return;

    if (freeIdx === freeCols.length) {
      // Compute pivot variable values
      let pivotSum = 0;
      let valid = true;

      for (let row = 0; row < rank; row++) {
        let val = matrix[row][numButtons];
        for (let f = 0; f < freeCols.length; f++) {
          val -= matrix[row][freeCols[f]] * freeVals[f];
        }
        const intVal = Math.round(val);
        if (intVal < 0 || Math.abs(intVal - val) > 1e-9) {
          valid = false;
          break;
        }
        pivotSum += intVal;
      }

      if (valid && freeSum + pivotSum < minPresses) {
        minPresses = freeSum + pivotSum;
      }
      return;
    }

    const col = freeCols[freeIdx];
    const maxVal = freeUpperBounds[freeIdx];

    for (let v = 0; v <= maxVal; v++) {
      freeVals[freeIdx] = v;
      searchFreeVars(freeIdx + 1, freeVals, freeSum + v);
    }
  }

  searchFreeVars(0, new Array(freeCols.length).fill(0), 0);

  return minPresses === Infinity ? -1 : minPresses;
}

export function part2(input: string): number {
  const machines = lines(input).map(parseJoltageMachine);
  const minPresses = machines.map(findMinJoltagePresses);
  return sum(minPresses);
}

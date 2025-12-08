// Advent of Code 2025 - Day 8
// https://adventofcode.com/2025/day/8

import { lines, product } from "../../utils";

type Point3D = [number, number, number];

// Union-Find data structure for tracking circuits
class UnionFind {
  parent: number[];
  rank: number[];
  size: number[];
  numCircuits: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array.from({ length: n }, () => 0);
    this.size = Array.from({ length: n }, () => 1);
    this.numCircuits = n;
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false; // Already in same circuit

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.rank[rootX]++;
    }
    this.numCircuits--;
    return true;
  }

  getCircuitSizes(): number[] {
    const sizes = new Map<number, number>();
    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      sizes.set(root, this.size[root]);
    }
    return Array.from(sizes.values());
  }
}

function parseInput(input: string): Point3D[] {
  return lines(input).map((line) => {
    const [x, y, z] = line.split(",").map(Number);
    return [x, y, z] as Point3D;
  });
}

function euclideanDistance(a: Point3D, b: Point3D): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Exported for testing with custom number of connections
export function solve(input: string, numConnections: number): number {
  const points = parseInput(input);
  const n = points.length;

  // Calculate all pairwise distances
  const pairs: { i: number; j: number; dist: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({ i, j, dist: euclideanDistance(points[i], points[j]) });
    }
  }

  // Sort by distance (ascending)
  pairs.sort((a, b) => a.dist - b.dist);

  // Connect the closest pairs using Union-Find
  const uf = new UnionFind(n);
  for (let k = 0; k < numConnections && k < pairs.length; k++) {
    const { i, j } = pairs[k];
    uf.union(i, j); // Connect even if already in same circuit (does nothing)
  }

  // Get circuit sizes and find the 3 largest
  const sizes = uf.getCircuitSizes().sort((a, b) => b - a);
  const top3 = sizes.slice(0, 3);

  return product(top3);
}

export function part1(input: string): number {
  return solve(input, 1000);
}

// Part 2: Find the last connection that joins all into one circuit
// Returns the product of X coordinates of those two junction boxes
export function solvePart2(input: string): number {
  const points = parseInput(input);
  const n = points.length;

  // Calculate all pairwise distances
  const pairs: { i: number; j: number; dist: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({ i, j, dist: euclideanDistance(points[i], points[j]) });
    }
  }

  // Sort by distance (ascending)
  pairs.sort((a, b) => a.dist - b.dist);

  // Connect pairs until we have one circuit
  const uf = new UnionFind(n);
  for (const { i, j } of pairs) {
    const merged = uf.union(i, j);
    if (merged && uf.numCircuits === 1) {
      // This was the last connection - multiply X coordinates
      return points[i][0] * points[j][0];
    }
  }

  return 0; // Should never reach here if input is valid
}

export function part2(input: string): number {
  return solvePart2(input);
}

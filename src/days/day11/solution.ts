// Advent of Code 2025 - Day 11
// https://adventofcode.com/2025/day/11

import { lines, sum } from "../../utils";

// Parse input into a graph: node -> list of output nodes
export function parseGraph(input: string): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  
  for (const line of lines(input)) {
    if (!line.trim()) continue;
    const [node, outputs] = line.split(": ");
    graph.set(node, outputs.split(" "));
  }
  
  return graph;
}

// Count all paths from start to end using memoization
export function countPaths(graph: Map<string, string[]>, start: string, end: string): number {
  const cache = new Map<string, number>();
  
  const countFrom = (node: string): number => {
    if (cache.has(node)) return cache.get(node)!;
    
    // Base case: reached the destination
    if (node === end) return 1;
    
    // No outputs from this node - dead end
    const outputs = graph.get(node);
    if (!outputs) return 0;
    
    // Sum paths through all outputs
    const result = sum(outputs.map(countFrom));
    cache.set(node, result);
    return result;
  };
  
  return countFrom(start);
}

export function part1(input: string): number {
  const graph = parseGraph(input);
  return countPaths(graph, "you", "out");
}

// Count paths from start to end that visit all required nodes
export function countPathsWithRequired(
  graph: Map<string, string[]>,
  start: string,
  end: string,
  required: string[]
): number {
  // Use bitmask to track which required nodes have been visited
  const requiredMask = (1 << required.length) - 1; // All bits set = all required visited
  const cache = new Map<string, number>();
  
  const countFrom = (node: string, visited: number): number => {
    const key = `${node}:${visited}`;
    if (cache.has(key)) return cache.get(key)!;
    
    // Update visited mask if current node is required
    let newVisited = visited;
    const reqIdx = required.indexOf(node);
    if (reqIdx !== -1) {
      newVisited |= (1 << reqIdx);
    }
    
    // Base case: reached the destination
    if (node === end) {
      // Only count if all required nodes have been visited
      return newVisited === requiredMask ? 1 : 0;
    }
    
    // No outputs from this node - dead end
    const outputs = graph.get(node);
    if (!outputs) return 0;
    
    // Sum paths through all outputs
    const result = sum(outputs.map(out => countFrom(out, newVisited)));
    cache.set(key, result);
    return result;
  };
  
  return countFrom(start, 0);
}

export function part2(input: string): number {
  const graph = parseGraph(input);
  return countPathsWithRequired(graph, "svr", "out", ["dac", "fft"]);
}

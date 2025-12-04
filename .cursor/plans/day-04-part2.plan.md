<!-- 331a59ad-f39b-437b-b9ff-ea30f9193d1d ef3ecf73-c65a-4eff-8acb-4aa7f1a4ca44 -->
# Day 4 Part 2 Solution

Implement the ripple-effect removal algorithm in [`src/days/day04/solution.ts`](src/days/day04/solution.ts).

## Algorithm

1. Parse input into mutable 2D grid
2. Create helper function `isAccessible(col, row)` - returns true if cell is `@` with < 4 `@` neighbors
3. Create helper function `tryRemove(col, row)` that:

   - Checks if cell is accessible
   - If yes: removes it (set to `.`), increments counter, then recursively calls `tryRemove` on all 8 neighbors

4. Iterate through grid, call `tryRemove` on each cell
5. Return total count

## Key Code Pattern

```typescript
function tryRemove(col: number, row: number): void {
  if (g[row]?.[col] !== '@') return;
  
  const neighborRolls = neighbors8(col, row)
    .filter(([nx, ny]) => g[ny]?.[nx] === '@')
    .length;
  
  if (neighborRolls < 4) {
    g[row][col] = '.';  // Remove the roll
    count++;
    // Check neighbors - they might now be accessible
    for (const [nx, ny] of neighbors8(col, row)) {
      tryRemove(nx, ny);
    }
  }
}
```

## Notes

- Reuses `grid` and `neighbors8` from utils (already imported)
- Grid is mutated in place as rolls are removed
- Recursion naturally handles the cascade effect
- Out-of-bounds handled by optional chaining (`g[row]?.[col]`)

### To-dos

- [] Implement part2 function in solution.ts

### To-dos

- [x] Implement part1 function in solution.ts
- [ ] Implement part1 function in solution.ts
- [ ] Implement part2 function with recursive removal
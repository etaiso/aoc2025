<!-- 331a59ad-f39b-437b-b9ff-ea30f9193d1d 6a9c85c2-33a4-416b-8741-2a6bfbd6ae26 -->
# Day 4 Part 1 Solution

Implement the algorithm in [`src/days/day04/solution.ts`](src/days/day04/solution.ts) using existing utilities from [`src/utils/index.ts`](src/utils/index.ts).

## Implementation

1. Import `grid` and `neighbors8` utilities
2. Parse input into 2D character array using `grid()`
3. Initialize counter to 0
4. Iterate through each cell (row, col)
5. For cells containing `@`:

   - Use `neighbors8(col, row)` to get 8 neighbor coordinates
   - Count neighbors that are `@` (out-of-bounds treated as `.`)
   - If count < 4, increment counter

6. Return counter

## Key Code Pattern

```typescript
for (let row = 0; row < g.length; row++) {
  for (let col = 0; col < g[row].length; col++) {
    if (g[row][col] === '@') {
      const neighborRolls = neighbors8(col, row)
        .filter(([nx, ny]) => g[ny]?.[nx] === '@')
        .length;
      if (neighborRolls < 4) count++;
    }
  }
}
```

Note: `g[ny]?.[nx] `handles out-of-bounds by returning `undefined`, which is not `@`, effectively treating it as `.`.

### To-dos

- [ ] Implement part1 function in solution.ts
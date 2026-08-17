# Fix subtract() returning the wrong result

**Type:** Bug fix

`subtract(a, b)` in `src/calculator.js` returns `a + b` instead of `a - b`.

## Acceptance criteria

- `subtract(5, 3)` returns `2`
- A test in `src/calculator.test.js` covers `subtract`
- `npm run test` passes

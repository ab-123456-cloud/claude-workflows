export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  // BUG: should be a - b
  return a + b;
}

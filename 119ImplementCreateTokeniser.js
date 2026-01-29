/**
 * Tokenizer for arithmetic expressions.
 * Yields tokens: numbers (as string) and single-char operators/parens.
 *
 * Valid input: non-negative integers, + - * / ( ) and spaces.
 *
 * Time:  O(n)  (single pass)
 * Space: O(1)  extra (generator state; output streamed)
 */
function* tokenize(input) {
  const s = String(input);
  const n = s.length;

  let i = 0;

  while (i < n) {
    const ch = s[i];

    // 1) Ignore spaces
    if (ch === ' ') {
      i++;
      continue;
    }

    // 2) Number token (multi-digit)
    // '0'..'9'
    if (ch >= '0' && ch <= '9') {
      const start = i;
      i++;
      while (i < n && s[i] >= '0' && s[i] <= '9') i++;
      yield s.slice(start, i); // keep as string: "20", "300"
      continue;
    }

    // 3) Operator / parentheses token
    // One of: + - * / ( )
    yield ch;
    i++;
  }
}

// ---- demo ----
const tokens = tokenize(' 1 * (20 -   300      ) ');

for (const t of tokens) {
  console.log(t);
}
// Output:
// 1
// *
// (
// 20
// -
// 300
// )

/**
 * Decodes a compressed string like:
 *   "3(ab)"       → "ababab"
 *   "3(ab2(c))"   → "abccabccabcc"
 *   "12(a)"       → "aaaaaaaaaaaa"
 * Supports nested parentheses and multi-digit counts.
 */
function uncompress(s) {
  const countStack = [];  // stack to hold repeat counts
  const stringStack = []; // stack to hold strings from outer contexts
  let curr = "";          // current building substring
  let num = 0;            // current number being parsed (may be multi-digit)

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch >= '0' && ch <= '9') {
      // convert character '0'-'9' to numeric digit
      // '0'.charCodeAt(0) = 48, so '2'.charCodeAt(0) - 48 = 2
      num = num * 10 + (ch.charCodeAt(0) - 48);
    } 
    else if (ch === '(') {
      // push the current number and string context onto stacks
      countStack.push(num);
      stringStack.push(curr);
      // reset for inner substring
      num = 0;
      curr = "";
    } 
    else if (ch === ')') {
      // end of a group — pop last repeat count and outer string
      const repeatCount = countStack.pop();
      const prev = stringStack.pop();
      // repeat the current string and append to the outer context
      curr = prev + curr.repeat(repeatCount);
    } 
    else {
      // plain alphabetic character, just append to current substring
      curr += ch;
    }
  }

  return curr;
}


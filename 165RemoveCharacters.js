function removeChars(str) {
  const stack = [];

  for (let ch of str) {

    // remove all 'b'
    if (ch === 'b') {
      continue;
    }

    // remove "ac"
    if (ch === 'c' && stack.length > 0 && stack[stack.length - 1] === 'a') {
      stack.pop(); // remove the 'a'
      continue;
    }

    // otherwise keep character
    stack.push(ch);
  }

  return stack.join('');
}
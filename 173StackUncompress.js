function uncompress(str) {
    const stack = [''];
    const count = [];
    let n = '';
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (/\d/.test(char)) {
        n += char;
      } else if (char === '(') {
        stack.push('');
        count.push(Number(n));
        n = '';
      } else if (char === ')') {
        const sequence = stack.pop();
        const times = count.pop();
        // @ts-ignore
        stack.push(stack.pop() + sequence.repeat(times));
      } else {
        stack.push(stack.pop() + char);
      }
    }
    return stack.pop();
  }

console.log(uncompress('3(ab2(c))')) // 'abccabccabcc'
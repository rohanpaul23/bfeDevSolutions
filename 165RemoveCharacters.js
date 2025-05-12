function removeChars(input) {
    let stack = [];

    for(let i = 0;i<input.length;i++){
        const char = input[i];
        // This will check the current character in the string and the top of the stack to make sure "ac" is not in result string.
        if(stack.length > 0 && char === 'c' && stack[stack.length-1] === 'a'){
            stack.pop();
        }
        // If current character is not "b" just push into stack
        else if(char !== 'b'){
            stack.push();
        }
    }
    return stack.join("")
  }
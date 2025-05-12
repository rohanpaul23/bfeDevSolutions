
/**
 * @param {HTMLElement} tree
 * @return {string[]}
 */
function getTags(tree) {
    const result = new Set();
    const stack = [tree];
    while(stack.length > 0){
     const target = stack.pop();
     result.add(target.tagName.toLowerCase());
     stack.push(...target.children);
    }
   return [...result];
  }
  
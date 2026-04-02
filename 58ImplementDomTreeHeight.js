function getHeight(tree) {
    let result = 0;      
    if(!tree){
      return result;
    }
    for (let child of tree.children) {
      result = Math.max(result, getHeight(child)); 
    }
    return 1 + result;
  }


  /**
 * Get height of DOM tree iteratively (BFS)
 * Time: O(n)
 * Space: O(w) (max width of tree)
 */
function getHeightIterative(root) {
  if (!root) return 0;

  let height = 0;
  const queue = [root];

  while (queue.length > 0) {
    const size = queue.length;

    // Process one level
    for (let i = 0; i < size; i++) {
      const node = queue.shift();

      for (let child of node.children) {
        queue.push(child);
      }
    }

    height++; // completed one level
  }

  return height;
}
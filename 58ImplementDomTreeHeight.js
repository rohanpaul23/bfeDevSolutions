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
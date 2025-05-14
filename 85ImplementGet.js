function get(source, path, defaultValue = undefined) {
    if(path.length === 0){
      return undefined
    }
  
    let pathKeys = [];
    const excludedCharactersFromPath = ['[',']','.'];
    for(let i = 0;i<path.length;i++){
        if(!excludedCharactersFromPath.includes(path[i])){
          pathKeys.push(path[i]);
        }
    }
  
    const value = pathKeys.reduce((sourceObj,key)=>{
      return sourceObj[key]
    },source)
    return value === undefined ? defaultValue : value;
  }
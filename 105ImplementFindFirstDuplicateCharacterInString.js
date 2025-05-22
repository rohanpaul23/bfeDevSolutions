function firstDuplicate(str) {
    if(str.length == 1) {
      return null;
    }
     const map = new Map();
     let i = 0;
  
     while(i<str.length){
      if(map.has(str[i])){
        return str[i];
      }
      else {
        map.set(str[i],(map.get(str[i]) || 0) + 1)
        i++;
      }
     }
     return null;
  }

console.log(firstDuplicate("abcdefe"))
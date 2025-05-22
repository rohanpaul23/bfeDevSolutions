function compress(str) {
    if(str.length === 0 || str.length === 1){
      return str;
    }
    const map = new Map();
    let res = "";
    map.set(str[0],1);
    for(let i=1;i<str.length;i++){
      if(map.has(str[i])){
        map.set(str[i],map.get(str[i])+1);
      }
      else {
        let keyValuePair = getKeyValue(map);
        res+=keyValuePair
        map.clear();
        map.set(str[i],1);
      }
    }
    if(map.entries().length !== 0){
        let keyValuePair = getKeyValue(map);
        res+=keyValuePair
    }
    return res;
  }

  function getKeyValue(map){
    let keyValuePair="";
    const key = map.keys().next().value;
        const value = map.values().next().value;
        if(value === 1){
            keyValuePair = key
        }
        else {
            keyValuePair =key+value
        }
        return keyValuePair;
  }

  console.log(compress('aaab'));
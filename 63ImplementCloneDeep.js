function cloneDeep(data) {
  const map = new Map();
  function clone(val,map){
    if(val === null || typeof val !== 'object'){
      return val;
    }
    if(map.has(val)){
      return map.get(val);
    }
    const output = Array.isArray(val) ? [] : {}
    map.set(val, output);
    const keys = [...Object.getOwnPropertySymbols(val), ...Object.keys(val)];
    for(let key of keys) {
      output[key] = clone(val[key], map)
    }
    return output
  }
  return clone(data,map)
}
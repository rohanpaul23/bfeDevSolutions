
/**
 * @param {any} target
 * @param {any[]} sources
 * @return {object}
 */
function objectAssign(target, ...sources) {
  if(target === null || target ===  undefined){
    throw Error();
  }

  target = Object(target);
  for (let source of sources) {
    console.log("source",source)
    if(source == null) continue;
    const allKeys = [...Object.keys(source), ...Object.getOwnPropertySymbols(source)]
     for (let key of allKeys) {
      target[key] = currSource[key];
      if(target[key] !== currSource[key]) {
        throw Error();
      }
    }
  }
  return target;
}

objectAssign({}, {a:3}, {b:4})  
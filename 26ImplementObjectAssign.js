
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
    if(source == null) continue;
    const allKeys = [...Object.keys(source), ...Object.getOwnPropertySymbols(source)]
    merge(allKeys, source);
  }

  function merge(keys = [], currSource) {
    for (let key of keys) {
      target[key] = currSource[key];
      if(target[key] !== currSource[key]) {
        throw Error();
      }
    }
  }
  return target;
}
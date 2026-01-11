
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
    for (let key of allKeys) {
      target[key] = source[key];
      if(target[key] !== source[key]) {
        throw Error();
      }
    }
  }
  return target;
}
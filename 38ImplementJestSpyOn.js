
/**
 * @param {object} obj
 * @param {string} methodName
 */
function spyOn(obj, methodName) {
  const calls = []

  const originalMethod = obj[methodName];

  if(typeof originalMethod != 'function'){
    throw new Error('not function')
  }

  obj[methodName] = function(...args){
    calls.push(args)
    return originalMethod.apply(this,args);
  }

  return {
    calls
  }

}
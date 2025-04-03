/**
 * @param {Function} func
 * @param {(args:[]) => string }  [resolver] - cache key generator
 */
function memo(func, resolver) {
    const cacheMap = new Map();
    return function(...args){
        const key = resolver ? resolver(...args) : args.join("-")
        if(cacheMap.has(key)){
            return cacheMap.get(key)
        }
        const result = func.apply(this,args);
        cacheMap.set(key,result);
        return result
    }
}
  
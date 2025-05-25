function isEqual(a, b, map = new Map()) {
    if(a === b) return true; // covers use case for primitive types and same objects
    
    if(typeof a !== 'object' ||  typeof b !== 'object'){
        return false;
    }
    
    // to handle circular ref use case
    if (map.has(a) && (map.get(a) === b)) return true;
    map.set(a, b);
    
    let keysA = Reflect.ownKeys(a);
    let keysB = Reflect.ownKeys(b);
    
    if(keysA.length !== keysB.length){
        return false;
    }
    
    for(let i = 0; i < keysA.length; i++){
        // compare keys too for use case like 
        // let obj1 = { a: { c: '4' } }
        // let obj2 = { b: { d: '4' } }
        if(keysA[i] !== keysB[i] || !isEqual(a[keysA[i]], b[keysB[i]], map)){
            return false;
        }
    }
    
    return true;
}
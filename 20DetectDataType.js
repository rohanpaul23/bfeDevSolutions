
/**
 * @param {any} data
 * @return {string}
 */
function detectType(data) {
    const map = new Map([
        ["Number", 'number'],
        ["String", 'string'],
        ["Boolean", 'boolean'],
        ["Array", 'array'],
        ["ArrayBuffer", 'arraybuffer'],
        ["Date", 'date'],
        ["Map", 'map'],
        ["Set", 'set'],
      ]);
    if(typeof data !== 'object'){
        return typeof data
    }
    if(data === null){
        return 'null'
    }
    if(map.has(data.constructor.name)){
        return map.get(data.constructor.name)
    }
    return 'object'
}
 
console.log(detectType(new Number(1)))
console.log(detectType(new String("test")))
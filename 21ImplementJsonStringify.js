
/**
 * @param {any} data
 * @return {string}
 */
function stringify(data) {
    const typeOfData = detectDataType(data);
    if(data === null) {
        return "null";
    }
    
    let checkForUndefined = undefinedConditions(data)

    if(!checkForUndefined){
        return undefined
    }
    
    if(typeOfData === 'object' || || typeOfData === 'map'){
        return _stringifyObject(data);
    }

    if(typeOfData === 'array') {
        return _stringifyArray(data);
    }
    return _stringify(typeOfData, data);
}

function undefinedConditions(data){
    if(data instanceof Function ||  typeof data === 'symbol'){
        return undefined
    }
    return true 
}


function _stringifyObject(objectData){
    let result = [];
    for(const key of Object.keys(objectData)){
        let val = objectData[key]
        const typeOfVal = detectDataType(val);


        if(!undefinedConditions(val) || val === undefined){
            continue;
        }
        let stringifiedKey = `\"${key}\":`;
        
        switch(typeOfVal){
            case 'array':
                stringifiedKey += _stringifyArray(val)
                break;
            case 'object':
                stringifiedKey += _stringifyObject(val)
                break;
            default:
            stringifiedKey += _stringify(typeOfVal, val);
        }
        result.push(stringifiedKey);
    }
    return `{${result.join(',')}}`;
}

function _stringifyArray(arrayData){
  let stringifiedData = [];

  for (const [index, val] of arrayData.entries()) {
    if (isNaN(index)) {
      continue;
    }

    const typeOfVal = detectDataType(val);

    switch (typeOfVal) {
      case 'array':
        stringifiedData.push(_stringifyArray(val));
        break;
      case 'object':
        stringifiedData.push(_stringifyObject(val));
        break;
      default:
        stringifiedData.push(_stringify(typeOfVal, val));
    }
  }
  return `[${stringifiedData.join(',')}]`;
}

function _stringify(typeOfData, data) {
    switch (typeOfData) {
      case 'string':
        return `\"${data}\"`;
      case 'number':
      case 'boolean':
        return String(data);
      case 'function':
        return undefined;
      case 'date':
        return `"${data.toISOString()}"`;
      case 'set':
      case 'map':
      case 'weakSet':
      case 'weakMap':
        return '{}';
      case 'bigint':
        throw new Error("TypeError: BigInt value can't be serialized in JSON");
      default:
        return 'null';
    }
  }
  

function detectDataType(data) {
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
    if((typeof data === 'number' && isNaN(data)) || data === Infinity){
      return 'null'
    }
    if(data === null){
      return 'null'
  }
  if(typeof data !== 'object'){
      return typeof data
  }
  if(map.has(data?.constructor?.name)){
      return map.get(data.constructor.name)
  }
  return 'object'
}
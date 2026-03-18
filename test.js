
function set(obj, path, value) {
  // your code here
  const pathKeys = Array.isArray(path) ? path : getKeys(path);
 
  let curr = obj;

  for(let i = 0; i < pathKeys.length - 1; i++ ){
    const key  = pathKeys[i];
    const nextKey = pathKeys[i+1];

    if(curr[key] === null){
        curr[key] = isValidArrayIndex(nextKey) ? [] : {};
    }
    curr = curr[key];
  }

curr[pathKeys[pathKeys.length - 1]] = value;
  return obj;
}


function getKeys(path){
  const allKeys = path.split(".");
  const res = []

  for(let i = 0; i < allKeys.length; i++){  
      const ch = allKeys[i];
      let token = "";
      for(const c of ch){
        if(c === "[" || c === ']'){
           if(token){
            res.push(token);
            token = "";
          }
        }
        else {
          token = token + c;
        }
      }
      if(token){
        res.push(token);
      }
  }
  console.log(res)
  return res
}

function isValidArrayIndex(key) {
  return String(Number(key)) === key && Number(key) >= 0;
}


const obj = {
  a: {
    b: {
      c: [1,2,3]
    }
  }
}


console.log(set(obj,['a', 'b', 'c', '2'],'BFE'));
console.log(set(obj,"a.c.d.01",'BFE'));

function deduplicate(arr) {
    const set = new Set();
    
    for(let i=0;i<arr.length;i++){
      if(!set.has(arr[i])){
        set.add(arr[i]);
      }
    }
    console.log("set values",set)
    return set;
}

const a = [1,5,'b',5,1,undefined, 'a', 'a', 'a', 'b', true, 'true',false, {}, {}]
const expected = new Set(a)
console.log(deduplicate(a).size === expected.size);
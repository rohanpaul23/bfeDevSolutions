function excludeItems(items, excludes) {
    const excludesMap = new Map();
  
    for (const { k, v } of excludes) {
      if (!excludesMap.has(k)) {
        excludesMap.set(k, new Set());
      }
      excludesMap.get(k).add(v);
    }

    const result = []

    items.map((item)=>{
        Object.keys(item).every((key)=>{
            if(!excludesMap.has(key) || !excludesMap.get(key).has(item[key])){
                result.push(item)
            }
        })
    })
    console.log(result)
    // return items.filter((item) =>
    //   Object.keys(item).every(
    //     // Time complexity of V8's Set.has() is practically O(1).
    //     (key) => !excludesMap.has(key) || !excludesMap.get(key).has(item[key])
    //   )
    // );
    return result
}

let items = [
    {color: 'red', type: 'tv', age: 18}, 
    {color: 'silver', type: 'phone', age: 20},
    {color: 'blue', type: 'book', age: 17}
 ]
 const excludes = [ 
  {k: 'color', v: 'silver'}, 
  {k: 'color', v: 'red'}
 ]

console.log(excludeItems(items, excludes))
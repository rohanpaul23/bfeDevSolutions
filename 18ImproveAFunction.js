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


 /**
 * Filters out items from the `items` array based on exclusion rules.
 *
 * @param {Array<Object>} items - The array of objects to filter.
 * @param {Array<Object>} excludes - An array of exclusion rules. 
 *        Each object should have a key `k` and a value `v`, and any item
 *        that has item[k] === v for any rule will be excluded.
 *
 * @returns {Array<Object>} A new array containing only the items 
 *                          that do NOT match any of the exclusion rules.
 */
function excludeItems(items, excludes) {
  return items.filter((item) =>
    // Keep the item only if it does NOT match any exclude rule
    excludes.every(({ k, v }) => item[k] !== v)
  );
}


console.log(excludeItems(items, excludes))
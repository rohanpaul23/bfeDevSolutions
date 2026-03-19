

function findTwo(arr) {
  // your code here
  const set = new Set(arr);
  console.log(set);
  for(let i = 0; i < arr.length; i++){
    let ele = arr[i];

    if(set.has(-ele)){
      return [i, arr.indexOf(-ele)];
    }
  }
}

console.log(findTwo([1,2,3,-1]))
// console.log(findTwo([1,2,3,-1,-2,0]))
// console.log(findTwo([1,2,3,4]))
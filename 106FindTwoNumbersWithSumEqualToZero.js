function findTwo(arr) {
    arr.sort();
    let i = 0;
    let j = arr.length-1;
    while(i<j){
      if(arr[i] + arr[j] === 0){
        return [i,j];
      }
      else if(arr[i] + arr[j] > 0){
        j--;
      }
      else{
        i++;
      }     
    }
    return null;
  }

  console.log(findTwo([1,2,3,-1]))
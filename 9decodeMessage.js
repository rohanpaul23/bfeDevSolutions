function decode(message) {
    let i = 0;
    let j = 0;
    let res = [];
  
    let totalRows = arr.length;
    let totalColumns = arr[0].length;
  
    while(i < totalRows && j < totalColumns){
        res.push(message[i++][j++])
        if(i === totalRows){
          i = i - (totalRows - 1);
        }
    }
  
    return res.join('');
  }
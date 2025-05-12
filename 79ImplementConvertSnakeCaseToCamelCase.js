function snakeToCamel(str) {
    let res = ""
    for(let i=0;i<str.length;i++){
      if(isValidSequence(str,i)){
        res = res + str[i+1].toUpperCase();
        i++;
      }
      else{
        res = res + str[i];
      }
    }
    return res;
  }
  

  function isValidSequence(str,targetIndex){
    if(targetIndex === 0 || targetIndex === str.length -1){
      return false;
    }
    if(str.length <=2){
      return false;
    }
    return str[targetIndex] === '_' && str[targetIndex-1] !== '_' && str[targetIndex+1] !== '_';
  }
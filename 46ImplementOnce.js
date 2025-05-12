function once(func) {
    let res;
    let fnExecuted = false
    return function (...args) {
      if(fnExecuted){
        return res;
      }
      res = func.apply(this,args);
      fnExecuted = true;
      return res;
    };
}

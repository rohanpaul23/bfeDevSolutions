function pipe(funcs) {
    return function (n) {
      let result = n;
      for (let func of funcs) {
        result = func(result);
      }
      return result;
    };
  }
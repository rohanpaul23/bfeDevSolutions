function fib(n) {
    const res = [0,1,1];
    for(let i = 3; i <= n; i++) {
      res.push(res[i-1] + res[i-2]);
    }
    return res[n];
  }
  
function race(funcs) {
  return function (finalCallback, data) {
    let done = false;

    funcs.forEach(func => {
      func((err, result) => {
        if (done) return;
        done = true;
        finalCallback(err ?? undefined, err ? undefined : result);
      }, data);
    });
  };
}

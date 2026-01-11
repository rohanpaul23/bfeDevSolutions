function parallel(funcs) {
  return function finalRunner(finalCallback, data) {
    const results = new Array(funcs.length);
    let completed = 0;
    let done = false; // prevents multiple finalCallback calls

    funcs.forEach((func, index) => {
      func((error, result) => {
        if (done) return;

        if (error) {
          done = true;
          finalCallback(error, undefined);
          return;
        }

        results[index] = result;
        completed++;

        if (completed === funcs.length) {
          done = true;
          finalCallback(undefined, results);
        }
      }, data);
    });
  };
}

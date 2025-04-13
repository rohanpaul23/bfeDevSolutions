function all(promises) {
    if (promises.length === 0) {
      return Promise.resolve([]);
    }
  
    const results = Array(promises.length);
    let count = 0;
  
    return new Promise((resolve, reject) => {
      promises.forEach((promise, i) => {
        if (!(promise instanceof Promise)) {
          promise = Promise.resolve(promise);
        }
  
        promise
          .then((res) => {
            results[i] = res;
            count++;
  
            if (count === promises.length) {
              resolve(results);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }
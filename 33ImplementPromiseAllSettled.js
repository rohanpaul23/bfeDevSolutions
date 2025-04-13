function allSettled(promises) {
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
        promise.then((value)=>{
          results[i] = {
            status: 'fulfilled',
            value,
          };
          count++;

          if(count === promises.length){
            resolve(results)
          }
        })
        .catch((reason)=>{
           results[i] = {
            status: 'rejected',
            reason,
          };

          count++;

          if(count === promises.length){
            resolve(results)
          }
        })
      });
    });
}
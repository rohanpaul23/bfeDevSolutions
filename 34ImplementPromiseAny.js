  function any(promises) {
      if (promises.length === 0) {
        return Promise.resolve();
      }
    
      let isPromiseFullFilled = false;
      const errors = Array(promises.length);
      let noOfErrors = 0;
    
      return new Promise((resolve,reject)=>{
        promises.forEach((promise,i)=>{
          promise.then((val)=>{
            if(isPromiseFullFilled){
              return;
            }
            resolve(val)
            isPromiseFullFilled = true
          })
          .catch((e)=>{
            errors[i] = e;
            noOfErrors++;
            if(noOfErrors === promises.length){
              reject(new AggregateError('No Promise in Promise.any was resolved', errors));
            }
          })
        })
      })
    }
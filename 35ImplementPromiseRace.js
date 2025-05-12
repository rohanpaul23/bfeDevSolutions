
/**
 * @param {Array<Promise>} promises
 * @return {Promise}
 */
function race(promises) {
    if(promises.length === 0){
      return Promise.resolve();
    }
    let isPromiseSettled = false;
    return new Promise((resolve,reject)=>{
      promises.forEach((promise)=>{
        promise.then((res)=>{
          if(isPromiseSettled) return
          isPromiseSettled = true
          resolve(res)
        })
        .catch(e=>{
          if(isPromiseSettled) return
          isPromiseSettled = true
          reject(e)
        })
      })
    })
  }
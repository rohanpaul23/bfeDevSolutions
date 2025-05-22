
// Using async await
async function throttlePromises(funcs, max){
    let start  = 0;
    const res = [];

    while(res.length < funcs.length){
        let currentPromises = funcs.slice(start,start + max);
        let currentRes;
        try{
         currentRes = await Promise.all(currentPromises.map((prom)=> prom()));
        }
        catch(e){
            throw e
        }
        res.push(...currentRes);
        start += max
    }
    return res;
}

// Without using async await

function throttlePromises(funcs, max){
    let results = [];
    let index = 0;
  
    function runBatch() {
      if (index >= funcs.length) {
        return Promise.resolve(results);
      }
  
      const batch = funcs.slice(index, index + max);
      index += max;
  
      return Promise.all(batch.map(fn => fn()))
        .then(batchResults => {
          results = results.concat(batchResults);
          return runBatch(); // Continue with next batch
        });
    }
  
    return runBatch();
  }
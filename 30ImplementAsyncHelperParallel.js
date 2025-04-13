
/*
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void

*/
function parallel(funcs){
    return function(finalCallback,data){
      let results = new Array(funcs.length);
      let hasError = false;
      let count = 0;
       funcs.forEach((func, i) => {
        func((err, data) => {
          if (hasError) {
            return;
          }
  
          if (err) {
            hasError = true;
            finalCallback(err, undefined);
            return;
          }
          
          if (err) {
            finalCallback(err, undefined);
            return;
          }
  
          results[i] = data;
          count++;
  
          if (count === funcs.length) {
            finalCallback(undefined, results);
          }
        }, data);
      });
    }
  }
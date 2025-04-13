/*
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void

*/
function race(funcs) {
  return function (finalCallback, data) {
    let completed = false;
    funcs.forEach((func, i) => {
      func((err, data) => {
        if (!completed) {
          if (err) {
            completed = true;
            finalCallback(err, undefined);
            completed = true;
          } else {
            finalCallback(undefined, data);
            completed = true;
          }
        }
      }, data);
    });
  };
}

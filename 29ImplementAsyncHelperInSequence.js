
/*
type Callback = (error: Error, data: any) => void

type AsyncFunc = (
   callback: Callback,
   data: any
) => void

*/
function sequence(funcs){
    return function(callback,data){
      let functionIndex = 0;
  
      const callNextFunc = (data) =>{
        if(functionIndex === funcs.length){
          callback(undefined,data)
          return
        }
  
        const nextFunction = funcs[functionIndex++];
        nextFunction((error, newData) => {
          if (error) {
            callback(error, undefined)
          } else {
            callNextFunc(newData)
          }
        }, data)
      }
      callNextFunc(data);
    }
  }
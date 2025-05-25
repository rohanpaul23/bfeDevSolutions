

// This is a JavaScript coding problem from BFE.dev 
/**
 * @param {(...args: any[]) => any} func
 * @param {number} wait
 * @param {boolean} option.leading
 * @param {boolean} option.trailing
 * @returns {(...args: any[]) => any}
 */
function debounce(func, wait, option = {leading: false, trailing: true}) {
  let timerId = null;
  let lastCallArgs = null;

  return function debounced(...args){
    if(!timerId && option.leading){
      func.apply(this,args);
    }
    else {
      lastCallArgs = args;
    }

    clearTimeout(timerId);
    timerId = setTimeout(()=>{
      if(option.trailing && lastCallArgs){
        func.apply(this,lastCallArgs);
      }
      lastCallArgs = null;
      timerId = null;
    },wait)
  }
}

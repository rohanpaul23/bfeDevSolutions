// This is a JavaScript coding problem from BFE.dev 

/**
 * @param {(...args:any[]) => any} func  - the function to throttle
 * @param {number} wait                  - minimum time (in ms) between calls
 * @returns {(...args:any[]) => any}     - a throttled version of func
 */
function throttle(func, wait) {
  let isWaiting = false;      // tracks whether we're in the "cooldown" period
  let lastCallArgs = null;    // stores the most recent arguments during cooldown

  return function throttled(...args) {
    // every call goes through this returned function

    if (!isWaiting) {
      // if not currently waiting, we can call immediately
      isWaiting = true;        // enter the cooldown state
      func.apply(this, args);  // invoke func with the current `this` and args

      // schedule exit from cooldown after `wait` ms
      setTimeout(() => {
        isWaiting = false;      // leave the cooldown state

        if (lastCallArgs) {
          // if there was a call during cooldown, invoke it now
          throttled.apply(this, lastCallArgs);  // re-enter throttled function with stored args
          lastCallArgs = null;                   // clear the stored args
        }
      }, wait);

    } else {
      // if we are in cooldown, update the stored args for a trailing call
      lastCallArgs = args;
      return;  // no immediate invocation
    }
  };
}

/**
 * @param {Function} func
 * @param {number} wait
 */
function throttle(func, wait) {
  let isInWaiting = false;
  let lastFnCallArgs = null;

  return function throttled(...args) {
    if (isInWaiting) {
      lastFnCallArgs = args;
      return;
    }

    // If we are not waiting, execute 'func' with passed arguments
    func.apply(this, args);
    // Prevent future execution of 'func'
    isWaiting = true;

    // After wait time,
    setTimeout(() => {
      // ...allow execution of 'func'
      isWaiting = false;

      // If arguments of last call exists,
      if (lastCallArgs) {
        // ...execute function throttled and pass last call's arguments
        // to it. Since now we are not waiting, 'func' will be executed
        // and isWaiting will be reset to true.
        throttled.apply(this, lastCallArgs);
        // ...reset arguments of last call to null.
        lastCallArgs = null;
      }
    }, wait);
  }
}
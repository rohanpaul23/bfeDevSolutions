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

    func.apply(this, args);
    isInWaiting = true;

    setTimeout(() => {
      isInWaiting = false;

      if (lastCallArgs) {
        throttled.apply(this, lastCallArgs);
        lastCallArgs = null;
      }
    }, wait);
  }
}
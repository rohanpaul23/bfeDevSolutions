function throttle(func, wait, option = { leading: true, trailing: true }) {
  // func: the function to throttle
  // wait: minimum time interval (ms) between invocations
  // option.leading: call func immediately on the first trigger
  // option.trailing: call func with the last args after the wait

  let waiting = false;      // are we currently in the throttle “cooldown”?
  let lastArgs = null;      // store the most recent args during cooldown

  return function throttled(...args) {
    // every call goes through this closure

    if (!waiting) {
      // if not in cooldown, we can schedule a call
      waiting = true;       // enter cooldown

      // helper to start the wait timer
      const startTimer = () =>
        setTimeout(() => {
          // when wait ms have passed:
          if (lastArgs && option.trailing) {
            // if there was a call during cooldown & trailing is enabled:
            func.apply(this, lastArgs);  // invoke with latest args
            lastArgs = null;             // clear stored args
            startTimer();                // restart timer for further bursts
          } else {
            // no pending calls or trailing disabled → exit cooldown
            waiting = false;
          }
        }, wait);

      if (option.leading) {
        // leading = true: invoke immediately
        func.apply(this, args);
      } else {
        // leading = false: defer this first call to the end
        lastArgs = args;
      }

      startTimer();  // kick off the cooldown timer
    } else {
      // already in cooldown: overwrite lastArgs with the newest call
      lastArgs = args;
    }
  };
}

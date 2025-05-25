function throttle(func, wait, option = {leading: true, trailing: true}) {
  let waiting = false;
  let lastArgs = null;
  return function throttled(...args) {
    if(!waiting) {
      waiting = true;
      const startWaitingPeriod = () => setTimeout(() => {
        if(option.trailing && lastArgs) {
          func.apply(this, lastArgs);
          lastArgs = null;
          startWaitingPeriod();
        }
        else {
          waiting = false;
        }
      }, wait);
      if(option.leading) {
        func.apply(this, args);
      } else {
        lastArgs = args; // if not leading, treat like another any other function call during the waiting period
      }
      startWaitingPeriod();
    }
    else {
      lastArgs = args; 
    }
  }
}
class FakeTimer {
  install() {
    this.original = {
      setTimeout : window.setTimeout,
      clearTimeout: window.clearTimeout,
      dateNow: Date.now
    }
    this.timerId = 1;
    this.timersArray = [];
    this.currentTime = 0;
    window.setTimeout = (cb, time, ...args) => {
      const id = this.timerId++;
      this.timersArray.push({
        id,
        cb,
        time: time + this.currentTime,
        args,
      });
      this.timersArray.sort((a, b) => a.time - b.time);
      return id;
    }
    window.clearTimeout = (removeId) => {
      this.timersArray = this.timersArray.filter(({ id }) => id !== removeId);
    }
    Date.now = () => {
      return this.currentTime;
    }
  }
  
  uninstall() {
    // restore the original implementation of
    // window.setTimeout, window.clearTimeout, Date.now
    window.setTimeout = this.original.setTimeout;
    window.clearTimeout = this.original.clearTimeout;
    Date.now = this.original.dateNow;
  }
  
  tick() {
    // run the scheduled functions without waiting
    while(this.timersArray.length) {
      const { cb, time, args } = this.timersArray.shift();
      this.currentTime = time;
      cb(...args);
    }
  }
}
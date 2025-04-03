class EventEmitter {
  constructor() {
    this.callbacksMap = new Map();
  }

  subscribe(eventName, callback) {
    if (this.callbacksMap.has(eventName)) {
      let callBackFunctions = this.callbacksMap.get(eventName);
      callBackFunctions.push(callback);
      this.callbacksMap.set(eventName, callBackFunctions);
    } else {
      this.callbacksMap.set(eventName, [callback]);
    }
    return {
      release: () => {
        const allCallbacks = this.callbacksMap.get(eventName);
        const callBackToRemove = allCallbacks.indexOf(callback);
        allCallbacks.splice(callBackToRemove, 1);
      },
    };
  }

  emit(eventName, ...args) {
    const cbs = this.callbacksMap.get(eventName);
    if (!cbs.length) {
      return;
    }
    for (const cb of cbs) {
      cb.apply(this, args);
    }
  }
}

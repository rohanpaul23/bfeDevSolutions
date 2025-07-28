/**
 * A simple EventEmitter implementation for subscribing to and emitting events.
 */
class EventEmitter {
  /**
   * Initialize a Map to hold eventName → array of callback functions.
   */
  constructor() {
    this.callbacksMap = new Map();
  }

  /**
   * Subscribe to an event by name.
   * @param {string} eventName - The name of the event to listen for.
   * @param {Function} callback - The function to call when the event is emitted.
   * @returns {{ release: Function }} - An object with a `release` method to unsubscribe.
   */
  subscribe(eventName, callback) {
    // If there are existing subscribers for this event, add to that list
    if (this.callbacksMap.has(eventName)) {
      let callBackFunctions = this.callbacksMap.get(eventName);
      callBackFunctions.push(callback);
      this.callbacksMap.set(eventName, callBackFunctions);
    } else {
      // Otherwise, start a new list of subscribers for this event
      this.callbacksMap.set(eventName, [callback]);
    }

    // Return an object that allows the subscriber to remove themselves
    return {
      release: () => {
        const allCallbacks = this.callbacksMap.get(eventName);
        // Find the index of the callback to remove
        const callBackToRemove = allCallbacks.indexOf(callback);
        if (callBackToRemove !== -1) {
          // Remove the callback from the array
          allCallbacks.splice(callBackToRemove, 1);
        }
      },
    };
  }

  /**
   * Emit an event, invoking all subscribed callbacks with the provided arguments.
   * @param {string} eventName - The name of the event to emit.
   * @param {...any} args - Arguments to pass to each callback.
   */
  emit(eventName, ...args) {
    const cbs = this.callbacksMap.get(eventName);
    // If no callbacks are registered, do nothing
    if (!cbs || cbs.length === 0) {
      return;
    }

    // Call each subscriber with the given arguments
    for (const cb of cbs) {
      cb.apply(this, args);
    }
  }
}

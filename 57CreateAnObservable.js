class Observable {
  
  constructor(setup) {
    // The 'setup' function is a producer function. It defines *how* this Observable
    // will emit values, errors, or completion notifications to its subscriber.
    // It receives the subscriberWrapper object when 'subscribe' is called.
    this._setup = setup;
  }
 
  subscribe(subscriber) {  // Similar to “fire” or “listen”
    // We create a wrapper object that manages subscription state.
    // It gives us control over next/error/complete calls and ensures
    // that once unsubscribed, no further notifications are sent.
    const subscriberWrapper = {
      unsubscribed: false, // Tracks whether the subscriber is still active
      
      // 🔹 next(value): Emit a new value to the subscriber
      next(value) {
        if (this.unsubscribed) return; // Stop if unsubscribed

        // Two subscription styles supported:
        // 1️⃣ Function form: observable.subscribe(value => ...)
        // 2️⃣ Object form: observable.subscribe({ next, error, complete })
        if (subscriber instanceof Function) return subscriber(value);
        return subscriber.next ? subscriber.next(value) : null;
      },

      // 🔹 error(err): Emit an error and terminate the stream
      error(value) {
        if (this.unsubscribed) return; // Stop if unsubscribed
        this.unsubscribe(); // Automatically stop after an error
        return subscriber.error ? subscriber.error(value) : null;
      }, 

      // 🔹 complete(): Notify subscriber that no more values will be emitted
      complete() {
        if (this.unsubscribed) return; // Stop if already done
        this.unsubscribe();  // Clean up
        return subscriber.complete ? subscriber.complete() : null;
      },

      // 🔹 unsubscribe(): Manually stop receiving values
      unsubscribe() {
        this.unsubscribed = true;
      }
    };

    // Execute the producer function and start the emission.
    // This function defines *when/how* the above next/error/complete are called.
    this._setup(subscriberWrapper);

    // Return the wrapper so external code can manually call `.unsubscribe()`
    return subscriberWrapper;
  }
}

/**
 * ============================
 * Custom MyPromise Implementation
 * ============================
 *
 * What this implementation handles:
 *
 * 1. Basic Promise States
 *    - pending → fulfilled / rejected
 *    - state is immutable once settled
 *
 * 2. Executor behavior
 *    - executor runs immediately
 *    - synchronous errors inside executor → reject
 *
 * 3. Asynchronous resolution
 *    - resolve/reject always happen in a microtask (queueMicrotask)
 *
 * 4. then() chaining
 *    - returns a new MyPromise
 *    - supports value transformation
 *    - supports error propagation
 *
 * 5. Error handling
 *    - errors thrown in callbacks → reject next promise
 *
 * 6. Promise adoption (VERY IMPORTANT)
 *    - if resolve(value) where value is a MyPromise:
 *        → current promise "follows" that promise
 *    - if a then() callback returns a MyPromise:
 *        → next promise adopts that returned promise
 *
 * 7. First call wins (resolve/reject)
 *    - only the first resolve/reject matters
 *    - later calls are ignored
 *
 * 8. Locking mechanism
 *    - if resolve() is called with another promise:
 *        → lock immediately
 *        → prevent further resolve/reject calls
 *
 * 9. Multiple .then()
 *    - callbacks are queued and executed in order
 *
 * 10. Static helpers
 *    - MyPromise.resolve()
 *    - MyPromise.reject()
 *
 * Limitations (intentionally simplified):
 *    - Does NOT support generic thenables (only MyPromise)
 *    - No finally()
 *    - No Promise.all / race
 */


class MyPromise {
  constructor(executor) {

    // -----------------------------
    // Internal state tracking
    // -----------------------------
    this.value = undefined;      // stores resolved/rejected value
    this.state = 'pending';      // 'pending' | 'fulfilled' | 'rejected'

    // -----------------------------
    // Callback queues
    // -----------------------------
    this.thenCallbacks = [];     // success handlers
    this.errorCallbacks = [];    // error handlers

    // -----------------------------
    // Lock flag
    // -----------------------------
    // Prevents multiple resolve/reject calls
    // especially important when resolving with another promise
    this.isLocked = false;

    // -----------------------------
    // Execute executor immediately
    // -----------------------------
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      // If executor throws → reject
      this.reject(e);
    }
  }


  /**
   * Executes all stored callbacks based on state
   */
  runAllCallbacks() {

    // -----------------------------
    // Fulfilled case
    // -----------------------------
    if (this.state === 'fulfilled') {

      const callbacks = this.thenCallbacks;

      // Clear queues before running to avoid re-entrancy issues
      this.thenCallbacks = [];
      this.errorCallbacks = [];

      callbacks.forEach(cb => cb(this.value));
    }

    // -----------------------------
    // Rejected case
    // -----------------------------
    else if (this.state === 'rejected') {

      const callbacks = this.errorCallbacks;

      this.thenCallbacks = [];
      this.errorCallbacks = [];

      callbacks.forEach(cb => cb(this.value));
    }
  }


  /**
   * Resolve the promise
   */
  resolve(value) {

    // Always async (microtask)
    queueMicrotask(() => {

      // Ignore if already settled OR locked
      if (this.state !== 'pending' || this.isLocked) return;

      // -----------------------------
      // Promise adoption
      // -----------------------------
      // If resolving with another MyPromise:
      // → lock immediately
      // → follow its result
      if (value instanceof MyPromise) {

        this.isLocked = true;

        return value.then(

          // When inner promise fulfills
          (val) => {
            if (this.state !== 'pending') return;

            this.state = 'fulfilled';
            this.value = val;

            this.runAllCallbacks();
          },

          // When inner promise rejects
          (err) => {
            if (this.state !== 'pending') return;

            this.state = 'rejected';
            this.value = err;

            this.runAllCallbacks();
          }
        );
      }

      // -----------------------------
      // Normal resolution
      // -----------------------------
      this.state = 'fulfilled';
      this.value = value;

      this.runAllCallbacks();
    });
  }


  /**
   * Reject the promise
   */
  reject(reason) {

    queueMicrotask(() => {

      // Ignore if already settled OR locked
      if (this.state !== 'pending' || this.isLocked) return;

      this.state = 'rejected';
      this.value = reason;

      this.runAllCallbacks();
    });
  }


  /**
   * then() method
   *
   * Returns a new promise
   */
  then(onFulfilled, onRejected) {

    return new MyPromise((resolve, reject) => {

      // -----------------------------
      // Success wrapper
      // -----------------------------
      const handleFulfilled = (result) => {

        // If no handler → pass value forward
        if (typeof onFulfilled !== 'function') {
          return resolve(result);
        }

        try {
          const returnedValue = onFulfilled(result);

          // 🔥 CRITICAL LINE
          // Handles:
          // - normal value
          // - thrown error
          // - returned promise (adoption)
          resolve(returnedValue);

        } catch (e) {
          reject(e);
        }
      };


      // -----------------------------
      // Error wrapper
      // -----------------------------
      const handleRejected = (reason) => {

        if (typeof onRejected !== 'function') {
          return reject(reason);
        }

        try {
          const returnedValue = onRejected(reason);

          // If error handler returns value → chain becomes fulfilled
          resolve(returnedValue);

        } catch (e) {
          reject(e);
        }
      };


      // -----------------------------
      // Based on current state
      // -----------------------------

      if (this.state === 'pending') {

        // Still pending → store callbacks
        this.thenCallbacks.push(handleFulfilled);
        this.errorCallbacks.push(handleRejected);

      } else if (this.state === 'fulfilled') {

        // Already fulfilled → schedule immediately
        queueMicrotask(() => handleFulfilled(this.value));

      } else if (this.state === 'rejected') {

        // Already rejected → schedule immediately
        queueMicrotask(() => handleRejected(this.value));
      }
    });
  }


  /**
   * catch() = then(null, onRejected)
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }


  /**
   * Static resolve
   */
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }


  /**
   * Static reject
   */
  static reject(value) {
    return new MyPromise((_, reject) => reject(value));
  }
}
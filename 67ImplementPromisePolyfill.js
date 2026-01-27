/**
 * MyPromise — an interview-grade Promise polyfill (Promises/A+-style core behavior)
 *
 * What this implementation supports:
 * ✅ State machine: pending -> fulfilled / rejected (only once)
 * ✅ Async handlers: `.then/.catch` callbacks run in microtasks
 * ✅ Chaining: `.then()` returns a new promise and adopts returned values/promises/thenables
 * ✅ Adoption: resolving with a promise/thenable "locks" the promise to that outcome
 * ✅ Safety: handles executor throw, thenable "call once" rule, and cycle detection
 *
 * What this does NOT implement (usually not required in interviews):
 * - unhandled rejection tracking
 * - `all`, `race`, `any`, `allSettled`
 * - cancellation
 */
class MyPromise {
  constructor(executor) {
    // --- Internal state ---
    this._state = "pending";   // "pending" | "fulfilled" | "rejected"
    this._value = undefined;   // fulfillment value OR rejection reason
    this._handlers = [];       // queued subscribers waiting for settlement

    // When we "adopt" another promise/thenable, we must ignore further resolve/reject calls
    // even though we haven't settled yet. This is the key to passing your failing test.
    this._locked = false;

    // Wrap resolve/reject so:
    // 1) user can call them safely
    // 2) we preserve correct `this`
    const resolve = (value) => this._resolve(value);
    const reject = (reason) => this._reject(reason);

    // The executor runs immediately and synchronously.
    // If it throws, the promise rejects.
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  /**
   * Resolve logic:
   * - If we get a plain value => fulfill immediately.
   * - If we get a promise/thenable => adopt it ("become" it), and LOCK immediately.
   */
  _resolve(value) {
    // Rule: A promise settles only once.
    // Also: if we already started adopting something, ignore other attempts.
    if (this._state !== "pending" || this._locked) return;

    // Self-resolution guard (cycle)
    if (value === this) {
      return this._reject(new TypeError("Cannot resolve promise with itself"));
    }

    // If `value` is an object/function, it might be a thenable.
    // Promises must adopt thenables, not just instances of MyPromise.
    if (value !== null && (typeof value === "object" || typeof value === "function")) {
      let then;
      try {
        // Accessing `then` can throw (getter).
        then = value.then;
      } catch (err) {
        return this._reject(err);
      }

      if (typeof then === "function") {
        // Adoption begins: LOCK immediately so further resolve/reject calls are ignored.
        this._locked = true;

        // "Call once" rule: a thenable may try to resolve/reject multiple times.
        let called = false;

        try {
          then.call(
            value,
            (y) => {
              if (called) return;
              called = true;
              // Keep adopting recursively (in case y is another thenable)
              this._locked = false; // (optional) state will move to settled soon anyway
              this._resolve(y);
            },
            (r) => {
              if (called) return;
              called = true;
              this._locked = false;
              this._reject(r);
            }
          );
        } catch (err) {
          // If then throws before it calls resolve/reject, reject.
          if (!called) {
            this._locked = false;
            this._reject(err);
          }
        }
        return;
      }
    }

    // Plain value: fulfill immediately
    this._fulfill(value);
  }

  /**
   * Fulfill the promise with a value (only if still pending).
   */
  _fulfill(value) {
    if (this._state !== "pending") return;
    this._state = "fulfilled";
    this._value = value;
    this._flushHandlers();
  }

  /**
   * Reject the promise with a reason (only if still pending and not locked by adoption).
   */
  _reject(reason) {
    if (this._state !== "pending" || this._locked) return;
    this._state = "rejected";
    this._value = reason;
    this._flushHandlers();
  }

  /**
   * Run all queued handlers asynchronously (microtask), then clear the queue.
   * Promise callbacks must never run synchronously in the same tick.
   */
  _flushHandlers() {
    queueMicrotask(() => {
      // Drain the queue and clear it (avoid memory leaks + double runs).
      const handlers = this._handlers;
      this._handlers = [];

      for (const h of handlers) {
        this._runOneHandler(h);
      }
    });
  }

  /**
   * Execute a single `.then` handler record, and settle the chained promise accordingly.
   */
  _runOneHandler(handlerRecord) {
    const { onFulfilled, onRejected, resolve, reject, promise2 } = handlerRecord;

    try {
      if (this._state === "fulfilled") {
        // Run the fulfillment handler
        const x = onFulfilled(this._value);
        // Whatever it returns settles `promise2` following the resolution procedure
        MyPromise._resolvePromise(promise2, x, resolve, reject);
      } else {
        // Run the rejection handler
        const x = onRejected(this._value);
        MyPromise._resolvePromise(promise2, x, resolve, reject);
      }
    } catch (err) {
      // Exceptions inside handlers reject the chained promise
      reject(err);
    }
  }

  /**
   * then(onFulfilled, onRejected)
   *
   * - returns a new promise (promise2)
   * - registers handlers on the current promise
   * - if current promise already settled, schedule flush immediately
   */
  then(onFulfilled, onRejected) {
    // Spec behavior:
    // - if onFulfilled is not a function, use identity
    // - if onRejected is not a function, use thrower (propagate errors)
    const realOnFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (v) => v;

    const realOnRejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };

    // Create the chained promise
    let promise2;
    promise2 = new MyPromise((resolve, reject) => {
      // Store the handler record
      this._handlers.push({
        onFulfilled: realOnFulfilled,
        onRejected: realOnRejected,
        resolve,
        reject,
        promise2, // used for cycle detection in resolve procedure
      });

      // If already settled, ensure handlers run (async).
      if (this._state !== "pending") {
        this._flushHandlers();
      }
    });

    return promise2;
  }

  /**
   * catch(onRejected) is just then(undefined, onRejected)
   */
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  /**
   * Promise Resolution Procedure for chaining:
   * settle promise2 based on x (return value of a handler)
   *
   * Handles:
   * - cycle detection (promise2 === x)
   * - adopting MyPromise
   * - adopting thenables
   * - plain values
   */
  static _resolvePromise(promise2, x, resolve, reject) {
    // Cycle detection: `return promise2` from a handler must reject
    if (promise2 === x) {
      return reject(new TypeError("Chaining cycle detected"));
    }

    // If x is a MyPromise, adopt it
    if (x instanceof MyPromise) {
      return x.then(resolve, reject);
    }

    // If x is an object/function, it might be a thenable
    if (x !== null && (typeof x === "object" || typeof x === "function")) {
      let then;
      try {
        then = x.then;
      } catch (err) {
        return reject(err);
      }

      if (typeof then === "function") {
        let called = false;
        try {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              // Resolve recursively in case y is another thenable
              MyPromise._resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } catch (err) {
          if (!called) reject(err);
        }
        return;
      }
    }

    // Otherwise, x is a plain value
    resolve(x);
  }

  /**
   * MyPromise.resolve(value)
   * - returns value if it's already a MyPromise
   * - otherwise returns a fulfilled MyPromise
   */
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((res) => res(value));
  }

  /**
   * MyPromise.reject(reason)
   * - returns a rejected MyPromise
   */
  static reject(reason) {
    return new MyPromise((_, rej) => rej(reason));
  }
}

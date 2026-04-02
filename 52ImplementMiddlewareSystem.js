/**
 * A very small middleware engine inspired by Express.
 *
 * It supports 2 kinds of middleware:
 *
 * 1) Normal middleware
 *    Signature: (req, next) => void
 *
 * 2) Error-handling middleware
 *    Signature: (err, req, next) => void
 *
 * High-level flow:
 *
 * start(req)
 *   -> calls next()
 *   -> next() runs the first normal middleware
 *   -> that middleware may call next()
 *   -> then the next middleware runs
 *
 * If next(err) is called, execution switches to error middleware.
 *
 * Important note:
 * This implementation MUTATES the middleware arrays using shift(),
 * so each middleware is consumed once.
 *
 * Time Complexity:
 * - use(): O(1)
 * - start(): O(1) to begin, actual full execution is O(n)
 * - next(): O(1) per middleware execution
 *
 * Space Complexity:
 * - O(n) to store middleware functions
 */

class Middleware {
  constructor() {
    // Queue of normal middleware functions.
    // Each function is expected to look like:
    // (req, next) => {}
    this.middleWareCallBacks = [];

    // Queue of error middleware functions.
    // Each function is expected to look like:
    // (err, req, next) => {}
    this.errorCallBacks = [];

    /**
     * Bind `next` to the current instance.
     *
     * Why is this needed?
     * -------------------
     * Later, we pass `this.next` as a callback into user middleware:
     *
     *   fn(this.req, this.next)
     *
     * If we do NOT bind it, then when middleware later calls:
     *
     *   next()
     *
     * the `this` inside next() would be lost.
     *
     * That would break access to:
     * - this.req
     * - this.middleWareCallBacks
     * - this.errorCallBacks
     *
     * bind(this) creates a new function that permanently remembers
     * the current Middleware instance as its `this`.
     */
    this.next = this.next.bind(this);
  }

  /**
   * Register a middleware function.
   *
   * @param {Function} func
   *
   * We distinguish middleware type by function arity (number of params):
   *
   * - func.length === 2  => normal middleware: (req, next)
   * - func.length === 3  => error middleware: (err, req, next)
   */
  use(func) {
    // Error middleware has 3 parameters:
    // (err, req, next)
    if (func.length === 3) {
      this.errorCallBacks.push(func);
    }
    // Normal middleware has 2 parameters:
    // (req, next)
    else if (func.length === 2) {
      this.middleWareCallBacks.push(func);
    }
  }

  /**
   * Start the middleware chain with a request object.
   *
   * @param {any} req
   *
   * Stores request on the instance so all middleware can access the same req.
   * Then immediately begins execution by calling next().
   */
  start(req) {
    // Save the current request so next() can use it
    this.req = req;

    // Start running middleware chain from the beginning
    this.next();
  }

  /**
   * Execute the next middleware in the chain.
   *
   * @param {Error} [err]
   *
   * Behavior:
   * - If err exists -> run next error middleware
   * - If no err     -> run next normal middleware
   *
   * Also catches synchronous throw from middleware
   * and forwards that thrown error to the next error middleware.
   */
  next(err) {
    // This will hold the middleware function we are about to execute
    let fn;

    try {
      // -------------------------------
      // Case 1: There is an error
      // -------------------------------
      if (err) {
        // Remove and get the first error middleware from the queue
        fn = this.errorCallBacks.shift();

        // If an error middleware exists, call it with:
        // (error, request, next)
        //
        // Example:
        // fn(err, req, next)
        fn(err, this.req, this.next);
      }

      // -------------------------------
      // Case 2: No error
      // -------------------------------
      else {
        // Remove and get the first normal middleware from the queue
        fn = this.middleWareCallBacks.shift();

        // Call normal middleware with:
        // (request, next)
        //
        // Example:
        // fn(req, next)
        fn(this.req, this.next);
      }
    } catch (e) {
      /**
       * If middleware throws synchronously, control jumps here.
       *
       * Example:
       *   use((req, next) => {
       *     throw new Error("something broke");
       *   })
       *
       * Then we try to forward that error to the next error middleware.
       */
      fn = this.errorCallBacks.shift();

      // Call error middleware with:
      // (caughtError, request, next)
      fn(e, this.req, this.next);
    }
  }
}
class Middleware {
  constructor() {
    // Queue to store normal middleware functions
    // Each function has signature: (req, next)
    this.middleWarecallbacks = [];

    // Queue to store error-handling middleware functions
    // Each function has signature: (err, req, next)
    this.errorCallbacks = [];

    // Bind `next` to this instance so that when it is passed
    // to middleware functions, `this` still refers to
    // the Middleware instance (not undefined)
    this.next = this.next.bind(this);
  }

  /**
   * Register a middleware function.
   * - If function expects 2 arguments → normal middleware
   * - If function expects 3 arguments → error middleware
   */
  use(func) {
    if (func.length === 2) {
      // Normal middleware: (req, next)
      this.middleWarecallbacks.push(func);
    } 
    else if (func.length === 3) {
      // Error-handling middleware: (err, req, next)
      this.errorCallbacks.push(func);
    }
  }

  /**
   * Start executing the middleware chain
   * with the given request object
   */
  start(req) {
    // Store request object on the instance
    this.req = req;

    // Begin middleware execution with no error
    this.next();
  }

  /**
   * Move execution to the next middleware.
   * - If `err` is provided, switch to error middleware
   * - Otherwise, continue normal middleware chain
   */
  next(err) {
    let fn;

    try {
      if (err) {
        // If an error is passed, take the next error handler
        fn = this.errorCallbacks.shift();

        // Call error middleware with (error, request, next)
        fn(err, this.req, this.next);
      } else {
        // No error → take the next normal middleware
        fn = this.middleWarecallbacks.shift();

        // Call middleware with (request, next)
        fn(this.req, this.next);
      }
    } catch (e) {
      // If a middleware throws synchronously,
      // catch the exception and forward it to
      // the next error-handling middleware
      fn = this.errorCallbacks.shift();
      fn(e, this.req, this.next);
    }
  }
}

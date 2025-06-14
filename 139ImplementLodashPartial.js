function partial(func, ...args) {
    return function(...restArgs) {
      const copyArgs = args.map(
        (arg) => arg === partial.placeholder ? restArgs.shift() : arg
      );
      return func.call(this, ...copyArgs, ...restArgs);
    } 
  }
  partial.placeholder = Symbol();
function range(from, to) {
  // Return an object that implements the iterator protocol
  return {
    // Define the method that returns the iterator itself
    [Symbol.iterator]() {
      // The iterator object must have a 'next()' method
      return {
        // 'next()' is called each time the iterator advances
        next() {
          // Return an object with 'done' and 'value' properties
          return {
            // 'done' tells whether the iteration should stop
            // When 'from' becomes greater than 'to', iteration ends
            done: from > to,

            // 'value' is the current number in the range
            // It returns the current 'from' value, then increments it
            value: from++
          };
        }
      };
    }
  };
}

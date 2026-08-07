/**
 * @param {integer} from - starting value of the range (inclusive)
 * @param {integer} to   - ending value of the range (inclusive)
 */
function range(from, to) {
  // We return an object that is ITERABLE
  // i.e., it implements [Symbol.iterator]()
  return {
    [Symbol.iterator]() {
      // IMPORTANT:
      // We create a LOCAL copy of `from` for iteration state.
      // This ensures:
      // 1. Each iteration gets its own state
      // 2. Original `from` is not mutated
      let current = from;

      // The iterator object must have a `next()` method
      return {
        next() {
          // If we have crossed the range, iteration is complete
          if (current > to) {
            return {
              done: true // tells JS iteration should stop
            };
          } else {
            // Otherwise return current value and move forward
            return {
              done: false,     // still more values to produce
              value: current++ // return current, then increment
            };
          }
        }
      };
    }
  };
}
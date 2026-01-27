/**
 * flattenThunk takes a thunk that may resolve to:
 *  - a value
 *  - another thunk
 *  - or an error
 *
 * It "flattens" the chain by repeatedly executing returned thunks
 * until a non-function value is produced.
 *
 * @param {Function} thunk - initial thunk to flatten
 * @returns {Function} a new thunk
 */
function flattenThunk(thunk) {
  // Return a new thunk
  return function (finalCallback) {

    /**
     * Executes the current thunk and handles its result.
     * If the result is another thunk, it continues recursively.
     */
    const run = (currentThunk) => {
      // Execute the thunk with a callback
      currentThunk((err, result) => {

        // If an error occurs at any step,
        // immediately stop and call finalCallback with the error
        if (err) {
          finalCallback(err, undefined);
          return;
        }

        // If the result is another thunk (a function),
        // continue flattening by running it
        if (typeof result === "function") {
          run(result);
          return;
        }

        // Otherwise, we have reached the final value.
        // On success, error must be undefined (per spec)
        finalCallback(err, result);
      });
    };

    // Start flattening from the initial thunk
    run(thunk);
  };
}

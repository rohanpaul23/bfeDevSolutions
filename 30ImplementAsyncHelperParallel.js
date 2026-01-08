/*
Callback signature:
(error: Error | null, data: any) => void

Each async function signature:
(callback: Callback, data: any) => void
*/

function parallel(funcs) {
  // Return a function that starts all async funcs in parallel
  return function (finalCallback, data) {
    // Array to store results in the same order as funcs
    const results = new Array(funcs.length);

    // Track how many functions have completed successfully
    let completedCount = 0;

    // Flag to ensure finalCallback is called only once (on first error)
    let hasError = false;

    // Edge case: no async functions
    if (funcs.length === 0) {
      return finalCallback(null, results);
    }

    // Start all async functions in parallel
    funcs.forEach((func, index) => {
      // Call each async function
      func((err, result) => {
        // If an er

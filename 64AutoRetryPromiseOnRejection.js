/**
 * @param {() => Promise<any>} fetcher
 * @param {number} maximumRetryCount
 * @return {Promise<any>}
 */
function fetchWithAutoRetry(fetcher, maximumRetryCount) {
  return new Promise((resolve, reject) => {

    // ------------------------------------------------------------
    // Helper function that performs the retry logic
    // ------------------------------------------------------------
    function attempt(remainingRetries) {
      // Call the fetcher (returns a Promise)
      fetcher()
        .then((data) => {
          // If success → resolve immediately
          resolve(data);
        })
        .catch((error) => {
          // If failed and retries are still available → retry
          if (remainingRetries > 0) {
            attempt(remainingRetries - 1);
          } else {
            // No retries left → reject
            reject(error);
          }
        });
    }

    // Start the first attempt
    attempt(maximumRetryCount);
  });
}
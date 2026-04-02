/**
 * Fetch up to `amount` items using cursor-based pagination.
 *
 * API rule:
 * - first call: fetchList()
 * - next call: fetchList(lastItemId)
 * - stop when API returns no items
 *
 * @param {number} amount
 * @returns {Promise<Array<{id: number}>>}
 *
 * Time Complexity:
 * - O(k), where k = number of items actually collected
 * - More precisely O(number of API calls + k)
 *
 * Space Complexity:
 * - O(k) for the result array
 */
async function fetchListWithAmount(amount = 5) {
  // If caller asks for 0 or negative amount, return empty array immediately
  if (amount <= 0) {
    return [];
  }

  const result = [];
  let since = undefined;

  // Keep fetching until:
  // 1) we collected enough items
  // 2) API returns no more items
  while (result.length < amount) {
    // Fetch one page
    const response = await fetchList(since);
    const items = response.items;

    // If API returns no items, no more data exists
    if (items.length === 0) {
      break;
    }

    // Add items one by one until we reach target amount
    for (const item of items) {
      if (result.length === amount) {
        break;
      }
      result.push(item);
    }

    // Update cursor using the last item from current page
    since = items[items.length - 1].id;
  }

  return result;
}
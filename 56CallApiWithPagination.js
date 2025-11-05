// fetchList is provided for you
// const fetchList = (since?: number) => 
//   Promise<{items: Array<{id: number}>}>


// you can change this to generator function if you want
const fetchListWithAmount = async (amount = 5) => {
  const result = [];
  let since = undefined; // initial request has no "since"

  while (result.length < amount) {
    const { items } = await fetchList(since);

    // If API returns nothing, we're done (no more data server-side)
    if (!items || items.length === 0) break;

    // Take only what's still needed to reach `amount`
    const remaining = amount - result.length;
    result.push(...items.slice(0, remaining));

    // Prepare `since` for the next page using the last item from this page
    const last = items[items.length - 1];
    since = last.id;
  }

  return result;
}

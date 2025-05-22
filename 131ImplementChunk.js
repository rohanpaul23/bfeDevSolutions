function chunk(items, size) {
  if (size === 0) return [];
  let res = [];
  for (let i = 0; i < items.length; i = i + size) {
    res.push(items.slice(i, i + size));
  }
  return res;
}

/**
 * @param {string} str
 * @returns {string | string[]}
 */
function count(str) {
  // 1) Frequency map
  const freq = new Map();
  for (const ch of str) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  // 2) Bucket sort by frequency (max possible freq = str.length)
  const buckets = Array.from({ length: str.length + 1 }, () => []);
  for (const [ch, f] of freq) {
    buckets[f].push(ch);
  }

  // 3) Find the highest frequency bucket that has characters
  for (let f = buckets.length - 1; f >= 1; f--) {
    if (buckets[f].length > 0) {
      return buckets[f].length === 1 ? buckets[f][0] : buckets[f];
    }
  }

  // str is non-empty, so we should never get here
  return "";
}

// Examples
console.log(count("abbccc"));      // "c"
console.log(count("abbcccddd"));   // ["c","d"] (order can vary)

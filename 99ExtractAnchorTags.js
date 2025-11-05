function extract(html) {
  // Start scanning from the beginning of the HTML string
  let i = 0;

  // Array to store extracted <a>...</a> substrings
  let res = [];

  // Keep scanning until we reach the end of the string
  while (i < html.length) {

    // Step 1️⃣: Find the next occurrence of '<a'
    // This marks the potential start of an anchor tag
    let start = html.indexOf('<a', i);

    // If no '<a' is found, return what we’ve collected so far
    if (start === -1) return res;

    // Step 2️⃣: Check if it’s a *real* <a> tag and not part of another word
    // For example, ignore <abbr> or <aside> which also start with '<a'
    // We only accept if the next character after '<a' is a space or '>'
    if (html[start + 2] !== ' ' && html[start + 2] !== '>') {
      // If it’s not a valid <a> tag, skip ahead a bit and continue searching
      i += 2;
    } else {
      // Step 3️⃣: Find where this <a> tag might close
      // The code looks for 'a>' (this is a simplification, not robust for malformed tags)
      let end = html.indexOf('a>', start + 2);

      // If we can’t find a closing part, stop and return collected anchors
      if (end === -1) return res;

      // Step 4️⃣: Extract the substring from the start of '<a' to the end of 'a>'
      // end + 2 ensures we include the trailing "a>"
      res.push(html.slice(start, end + 2));

      // Step 5️⃣: Move the cursor forward so we don’t re-scan the same section
      i = end + 2;
    }
  }

  // Step 6️⃣: Return all extracted anchor tag substrings
  return res;
}

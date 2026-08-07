/**
 * @param {string} html
 * @param {string[]} keywords
 * @return {string}
 */
function highlightKeywords(html, keywords) {
  // `mark[i]` tells us whether the character at index `i`
  // in the original string should be highlighted.
  //
  // Example:
  // html = "abcxyz123"
  // mark = [true, true, true, false, false, false, true, true, true]
  //
  // That would mean:
  // - "abc" should be highlighted
  // - "xyz" should not
  // - "123" should be highlighted
  const mark = new Array(html.length).fill(false);

  // Go through every keyword and find ALL of its occurrences
  // inside the original string.
  for (const keyword of keywords) {
    // `start` is the position from which we begin searching.
    // We move it forward so we can find later matches too.
    let start = 0;

    while (true) {
      // Find the next occurrence of `keyword` starting from `start`
      const index = html.indexOf(keyword, start);

      // If indexOf returns -1, that means no more matches exist
      if (index === -1) break;

      // Mark every character covered by this keyword match as `true`
      //
      // Example:
      // html = "abcxyz123"
      // keyword = "abc"
      // index = 0
      //
      // Then we mark:
      // mark[0] = true
      // mark[1] = true
      // mark[2] = true
      for (let i = index; i < index + keyword.length; i++) {
        mark[i] = true;
      }

      // Move `start` forward by 1 so we can continue searching.
      //
      // Why `index + 1` and not `index + keyword.length`?
      // Because matches can overlap.
      //
      // Example:
      // html = "aaab"
      // keyword = "aa"
      //
      // Matches are at:
      // - index 0 => "aa"
      // - index 1 => "aa"
      //
      // If we jump by keyword.length, we may miss overlapping matches.
      start = index + 1;
    }
  }

  // Now build the final output string using the `mark` array.
  let result = "";
  let i = 0;

  // Scan the original string from left to right.
  while (i < html.length) {
    // If this character is NOT part of any keyword match,
    // just copy it directly into the result.
    if (!mark[i]) {
      result += html[i];
      i++;
    } else {
      // If this character IS marked, that means we are entering
      // a highlighted region.
      result += "<em>";

      // Keep adding characters as long as they belong
      // to the same continuous highlighted block.
      //
      // This automatically merges:
      // - overlapping matches
      // - adjacent matches
      //
      // into one single <em>...</em> block.
      while (i < html.length && mark[i]) {
        result += html[i];
        i++;
      }

      // Once we leave the highlighted block, close the tag.
      result += "</em>";
    }
  }

  // Return the fully constructed string
  return result;
}
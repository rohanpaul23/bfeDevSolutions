/**
 * Convert a compressed string into its original form.
 *
 * Examples:
 *   "3(ab)"       -> "ababab"
 *   "3(ab2(c))"   -> "abccabccabcc"
 *   "12(a)"       -> "aaaaaaaaaaaa"
 *
 * Idea:
 * We read the string from left to right.
 * - digits build the repeat count
 * - '(' means a new inner group starts
 * - ')' means the current group ends, so we repeat it and attach it back
 * - letters are added directly to the current text
 */
function uncompress(str) {
  // Stores repeat counts for each nested group.
  // Example for "3(ab2(c))":
  // when we see "3(", we store 3
  // when we later see "2(", we store 2
  const countStack = [];

  // Stores the text that existed BEFORE entering a new group.
  // Example:
  // in "3(ab2(c))", before entering "2(c)", currentText is "ab"
  // so we save "ab" here
  const textStack = [];

  // The text we are currently building at the current nesting level
  let currentText = "";

  // The number we are currently reading.
  // Kept as a string so multi-digit counts like "12" are easy to build.
  let currentNumber = "";

  // Go through every character in the input
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    // -----------------------------
    // Case 1: current character is a digit
    // -----------------------------
    // Example:
    // "12(a)"
    // read '1' -> currentNumber = "1"
    // read '2' -> currentNumber = "12"
    if (ch >= "0" && ch <= "9") {
      currentNumber += ch;
    }

    // -----------------------------
    // Case 2: opening bracket '('
    // -----------------------------
    // This means a new inner group is starting.
    //
    // Example in "3(ab2(c))":
    // before entering the first '(', currentNumber = "3", currentText = ""
    // before entering the second '(', currentNumber = "2", currentText = "ab"
    //
    // We must save both pieces of information:
    // 1) how many times the inner group should repeat
    // 2) what text we had already built before entering the group
    else if (ch === "(") {
      countStack.push(Number(currentNumber));
      textStack.push(currentText);

      // Reset for the new inner group
      currentNumber = "";
      currentText = "";
    }

    // -----------------------------
    // Case 3: closing bracket ')'
    // -----------------------------
    // This means the current inner group is complete.
    //
    // Steps:
    // 1) get the repeat count for this group
    // 2) get the text from the outer level
    // 3) repeat the current inner text
    // 4) attach it back to the outer text
    else if (ch === ")") {
      const repeatCount = countStack.pop();
      const previousText = textStack.pop();

      // Build repeated version of currentText manually
      // Example:
      // currentText = "c", repeatCount = 2 -> repeated = "cc"
      let repeated = "";
      for (let j = 0; j < repeatCount; j++) {
        repeated += currentText;
      }

      // Merge with outer text
      // Example:
      // previousText = "ab", repeated = "cc" -> currentText = "abcc"
      currentText = previousText + repeated;
    }

    // -----------------------------
    // Case 4: normal character
    // -----------------------------
    // Just add it to the current text being built
    else {
      currentText += ch;
    }
  }

  // At the end, currentText contains the fully uncompressed result
  return currentText;
}

console.log(uncompress("3(ab2(c))")); // abccabccabcc
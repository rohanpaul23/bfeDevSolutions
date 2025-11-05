function generateSelector(root, target) {
  // Step 1: Start from the target element and move upward through the DOM tree
  let current = target;

  // Step 2: Initialize an empty string to build the selector path
  let result = "";

  // Step 3: Traverse up the DOM until reaching the specified root element
  while (current !== root) {
    // Step 4: Build a selector fragment for the current element
    // - current.tagName.toLowerCase(): get the lowercase tag name (e.g., 'div', 'span')
    // - current.id ? `#${current.id}` : "": if the element has an id, append it (e.g., '#main')
    // - Prepend '> ' to represent direct parent-child relation in CSS selector
    // - Append existing result (the previously built path)
    result = `> ${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ""} ${result}`;

    // Step 5: Move up one level to the parent element
    current = current.parentElement;
  }

  // Step 6: Finally, include the root element at the beginning of the selector
  // - root.tagName.toLowerCase(): get its tag name (e.g., 'body', 'div')
  // - Combine with the constructed selector chain
  return `${root.tagName.toLowerCase()} ${result}`;
}

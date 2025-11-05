function getIntersection(arr1, arr2) {
  // Step 1: Convert both input arrays to Sets
  // This automatically removes any duplicate elements within each array.
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  // Step 2: Initialize an empty array to store the intersection result
  const result = [];

  // Step 3: Loop through each unique element in set1
  for (const item of set1) {
    // Step 4: Check if this element also exists in set2
    // If yes, it means the element is common to both arrays
    if (set2.has(item)) {
      // Step 5: Add the common element to the result array
      result.push(item);
    }
  }

  // Step 6: Return the intersection array (unique common elements)
  return result;
}

// Example usage:
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [4, 5, 6, 7, 8];
const intersection = getIntersection(arr1, arr2);
console.log(intersection); // Output: [4, 5]
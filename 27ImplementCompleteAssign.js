  function completeAssign(target, ...sources) {
     // null and undefined cannot be converted to objects,
  // so copying into them is invalid
  if (target === null || target === undefined) {
    throw new Error();
  }

  // Convert primitive target values into wrapper objects
  // so properties can be defined on them
  target = Object(target);

  // Process each source one by one
  for (const source of sources) {
    // Skip only invalid sources
    if (source === null || source === undefined) continue;

    // Copy all own property descriptors from source to target
    // This preserves getters, setters, and descriptor flags
    Object.defineProperties(
      target,
      Object.getOwnPropertyDescriptors(Object(source))
    );
  }

  // Return the modified target object
  return target;
  }

// Object.defineProperties() is a JavaScript method that defines or modifies multiple properties on an object at once, using property descriptors for each property.
// Object.getOwnPropertyDescriptors() is a built-in JavaScript method that returns all own property descriptors of an object. It provides detailed information about each property, including its value, writability, enumerability, configurability, and getter/setter functions.
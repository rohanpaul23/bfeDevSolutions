function undefinedToNull(value) {
  // Replace undefined itself
  if (value === undefined) {
    return null;
  }

  // Primitives and null stay as-is
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Arrays → map each element
  if (Array.isArray(value)) {
    return value.map(item => undefinedToNull(item));
  }

  // Objects → recursively convert each property
  const result = {};

  for (const key in value) {
    // Only copy own enumerable properties
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const prop = value[key];

      // ❗ THIS is where undefined should be checked
      if (prop === undefined) {
        result[key] = null;
      } else {
        result[key] = undefinedToNull(prop);
      }
    }
  }

  return result;
}

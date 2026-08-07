function update(data, command) {

  // ---------------------------------------------
  // $set
  // ---------------------------------------------
  // Completely replace the current target.
  if (
    command &&
    Object.prototype.hasOwnProperty.call(command, "$set")
  ) {
    return command.$set;
  }

  // ---------------------------------------------
  // $apply
  // ---------------------------------------------
  // Apply a function to the current target
  // and replace it with the returned value.
  if (
    command &&
    Object.prototype.hasOwnProperty.call(command, "$apply")
  ) {
    return command.$apply(data);
  }

  // ---------------------------------------------
  // $push
  // ---------------------------------------------
  // Target must be an array.
  if (
    command &&
    Object.prototype.hasOwnProperty.call(command, "$push")
  ) {
    if (!Array.isArray(data)) {
      throw new Error("$push target must be an array");
    }

    return [
      ...data,
      ...command.$push
    ];
  }

  // ---------------------------------------------
  // $merge
  // ---------------------------------------------
  // Target must be an object.
  if (
    command &&
    Object.prototype.hasOwnProperty.call(command, "$merge")
  ) {
    if (
      typeof data !== "object" ||
      data === null ||
      Array.isArray(data)
    ) {
      throw new Error("$merge target must be an object");
    }

    return {
      ...data,
      ...command.$merge
    };
  }

  // ---------------------------------------------
  // Nested update
  // ---------------------------------------------

  // Copy only the current level.
  const result = Array.isArray(data)
    ? [...data]
    : { ...data };

  // Process each nested key.
  for (const key in command) {
    result[key] = update(
      data[key],
      command[key]
    );
  }

  return result;
}
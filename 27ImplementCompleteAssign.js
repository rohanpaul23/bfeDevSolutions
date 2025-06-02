function completeAssign(target, ...sources) {
   if(target === null || target ===  undefined){
    throw Error();
  }

  target = Object(target);
  for(const source of sources){
    if(!source) continue;
    Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));
  }
  return target;
}

// Object.defineProperties() is a JavaScript method that defines or modifies multiple properties on an object at once, using property descriptors for each property.
// Object.getOwnPropertyDescriptors() is a built-in JavaScript method that returns all own property descriptors of an object. It provides detailed information about each property, including its value, writability, enumerability, configurability, and getter/setter functions.
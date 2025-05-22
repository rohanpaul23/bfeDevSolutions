function myInstanceOf(obj, target) {
    if (obj == null || typeof obj !== 'object') return false; // (1)
    const proto = Object.getPrototypeOf(obj); // (2)
    return proto === target.prototype ? true : myInstanceOf(proto, target); // (3)
}

/*
(1) - If obj is null (i.e. top of the prototype chain), it isn't an instance
      of target. Return false
    - An instance has to be an object. If obj is not an object, it cannot
      be an instance of anything. Return false
(2) - Get the prototype of obj
(3) - If obj's [[prototype]] (i.e. proto) is the targets prototype property
      (i.e. target.prototype), then obj is an instance of target
    - Otherwise, check check the next prototype in the chain
*/
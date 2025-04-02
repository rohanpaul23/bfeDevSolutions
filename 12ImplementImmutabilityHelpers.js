/**
 * @param {any} data
 * @param {Object} command
 */
function update(data, command) {
    if (typeof data !== 'object' && !Array.isArray(data)) {
      throw new Error();
    }
  
    let copiedData =  Array.isArray(data) ? [...data] : {...data}
    _update(copiedData, command);
    return copiedData;
  }
  
  function _update(data, command) {
    for (const key in command) {
      if (key === '$push' && Array.isArray(command[key]) && Array.isArray(data)) {
        data.push(...command[key]);
        return;
      }
  
      if (
        typeof command[key] === 'object' &&
        command[key].hasOwnProperty('$set')
      ) {
        data[key] = command[key].$set;
        return;
      }
  
      if (
        typeof command[key] === 'object' &&
        command[key].hasOwnProperty('$apply') &&
        Array.isArray(data)
      ) {
        if (data[key]) {
          data[key] = command[key].$apply(data[key]);
          return;
        }
      }
  
      if (
        typeof command[key] === 'object' &&
        command[key].hasOwnProperty('$merge')
      ) {
        if (typeof data[key] === 'object') {
          data[key] = {
            ...data[key],
            ...command[key].$merge,
          };
          return;
        } else {
          throw new Error();
        }
      }
  
      if (typeof command[key] === 'object') {
        _update(data[key], command[key]);
      }
    }
  }

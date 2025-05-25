
Array.prototype.myMap = function(callback, thisObj) {
  const result = [];
  this.forEach((item, index) => {
    result[index] = callback.call(thisObj, item, index, this);
  });
  return result;
}
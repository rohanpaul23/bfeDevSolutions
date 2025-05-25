// your code here
let counter = 1
function count() {
  return counter++;
}
count.reset = function () {
  counter = 1;
}
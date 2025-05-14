
const map = new Map();
function mySetInterval(func, delay, period) {
  let counter = 0;
  const timerIdKey = Math.random();
  const intervalHelper = () => {
    const timerId = setTimeout(() => {
      func();
      intervalHelper();
    }, delay + period * counter);
    map.set(timerIdKey,timerId);
    counter++;
  };
  
  intervalHelper();
  
  return timerIdKey;
}


function myClearInterval(id) {
  clearTimeout(map.get(id));
}
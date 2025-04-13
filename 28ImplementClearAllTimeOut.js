
const timerIds= []
const originalSetTimeout = window.setTimeout;

window.setTimeout = function(cb,delay){
  let timerId = originalSetTimeout(cb,delay)
  timerIds.push(timerId)
  return timerId;
}


function clearAllTimeout() {
  for(const timerId of timerIds){
    clearTimeout(timerId);
  }
}

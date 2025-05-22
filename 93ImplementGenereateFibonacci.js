var results={};
function fib(n){
  if (n === 0) return 0
  if (n === 1) return 1
  if(!results[n]){
    results[n]= fib(n - 1) + fib(n - 2);
  }
  return results[n]
}
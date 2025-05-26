function largestDiff(arr) {
   // your code here
  if (arr.length <= 1) return 0
  arr.sort((a,b) => a - b)
  return Math.abs(arr[0] - arr[arr.length - 1])
}
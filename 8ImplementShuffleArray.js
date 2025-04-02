// This solution is based upon fisher yates algorithm
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [arr[randomIndex], arr[i]] = [arr[i], arr[randomIndex]];
    }
}


console.log(shuffle([1, 2, 3, 4]))
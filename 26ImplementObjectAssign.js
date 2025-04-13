/**
 * @param {any[]} items
 * @param {number[]} newOrder
 * @return {void}
 */
function sort(items, newOrder) {
    for(let i=0;i<newOrder.length;i++){
        let newIndex = newOrder[i]
        if(newIndex !== i){
            swap(items, i, newOrder[i])
            swap(newOrder, i, newOrder[i])
        }
    }
}


function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]]
}

const items = ['A', 'B', 'C', 'D', 'E', 'F']
const newOrder = [1,   5,   4,   3,   2,   0]

/**
 * @param {HTMLElement} rootA
 * @param {HTMLElement} rootB - rootA and rootB are clone of each other
 * @param {HTMLElement} nodeA
 */
const findCorrespondingNode = (rootA, rootB, target) => {
    let stackA = [rootA]
    let stackB = [rootB]

    while(stackA.length){
        const currentA = stackA.pop()
        const currentB = stackB.pop()

        if(currentA === target){
           return currentB
        }
        stackA.push(...currentA.children)
        stackB.push(...currentB.children)
    }
}

let tree1 = document.getElementById('tree1')
let tree2 = document.getElementById('tree2')

let target = document.getElementById('nestedTarget')

console.log(findCorrespondingNode(tree1,tree2,target))
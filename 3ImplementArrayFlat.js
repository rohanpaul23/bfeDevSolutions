function flat(arr, depth = 1) {
    let result = [];
    arr.forEach(item => {
        if(Array.isArray(item) && depth > 0) {
        result.push(...flat(item, depth - 1));
        } 
        else result.push(item);
    });
    return result;
}

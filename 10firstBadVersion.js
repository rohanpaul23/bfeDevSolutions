var solution = function(isBadVersion) {
    /**
     * @param {integer} n Total versions
     * @return {integer} The first bad version
     */
    return function(n) {
        let leftPtr = 1;
        let rightPtr = n;

        while (leftPtr < rightPtr) {
            let mid = leftPtr + Math.floor((rightPtr - leftPtr) / 2);
            if (isBadVersion(mid)) {
                rightPtr = mid;
            } else {
                leftPtr = mid + 1;
            }
        }
        return leftPtr
    };
};
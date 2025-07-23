
/**
 * @param {(...args) => void} func
 * @returns {(...args) => Promise<any}
 */
function promisify(func) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      func.apply(this, [...args, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }])
    })
  }
}

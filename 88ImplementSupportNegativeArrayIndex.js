// This would require a understanding of Proxy objects and Reflect API
// https://www.youtube.com/watch?v=TGGoiJBuv-Y&ab_channel=PiyushGarg has simple explaination for the above concepts
// https://blog.logrocket.com/working-with-the-javascript-reflect-api/ 
/**
 * wrap(arr)
 *
 * This function wraps a JavaScript array using Proxy
 * to support Python-style negative indexing.
 *
 * Example:
 *
 * const originalArr = [1,2,3]
 * const arr = wrap(originalArr)
 *
 * arr[0]  -> 1
 * arr[-1] -> 3
 * arr[-2] -> 2
 * arr[-3] -> 1
 *
 * All operations must still affect the original array:
 *
 * arr.push(4)
 * originalArr -> [1,2,3,4]
 *
 * arr[-1] = 5
 * originalArr -> [1,2,5]
 *
 * Why Proxy?
 * ----------
 * JavaScript arrays do not support negative indexes.
 * arr[-1] is treated as a string property "-1".
 *
 * Proxy lets us intercept property access (get / set)
 * and rewrite negative indexes to positive ones.
 *
 * We use Reflect.get / Reflect.set to forward operations
 * to the original array safely.
 */

function wrap(arr) {
  // Create a Proxy around the original array
  return new Proxy(arr, {

    /**
     * GET trap
     *
     * Runs whenever someone reads a property:
     *
     * arr[0]
     * arr[-1]
     * arr.length
     * arr.push
     * arr[Symbol.iterator]
     */
    get(target, property) {

      // Important:
      // Symbol.iterator is used for iteration:
      // for...of, spread [...arr], Array.from(arr)
      // We must forward it directly.
      if (property === Symbol.iterator) {
        return Reflect.get(target, property)
      }

      // Try to convert property to number
      // property is usually a string
      // "-1", "0", "push", "length"
      let index = parseInt(property, 10)

      // If index is negative, convert to positive index
      if (index < 0) {

        // Python style index conversion
        // realIndex = length + index
        // Example:
        // length = 3, index = -1 -> 2
        index = target.length + index

        // Get value from original array
        return Reflect.get(target, index)
      }

      // Default behavior for normal properties
      // Handles:
      // arr[0]
      // arr.length
      // arr.push
      // arr.bfe
      return Reflect.get(target, property)
    },

    /**
     * SET trap
     *
     * Runs whenever someone writes:
     *
     * arr[0] = 1
     * arr[-1] = 5
     * arr.bfe = 'bfe'
     */
    set(target, property, value) {

      // Convert property to number if possible
      let index = parseInt(property, 10)

      // Handle negative index assignment
      if (index < 0) {

        // Convert negative index to positive index
        index = arr.length + index

        // Check bounds
        // Example:
        // length = 3, index = -4 -> -1 (invalid)
        if (index < 0) {
          throw new Error('index out of bounds')
        }

        // Write to original array
        return Reflect.set(target, index, value)
      }

      // Default behavior
      // arr[0] = value
      // arr.bfe = value
      return Reflect.set(target, property, value)
    }

  })
}
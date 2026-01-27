// This would require a understanding of Proxy objects and Reflect API
// https://www.youtube.com/watch?v=TGGoiJBuv-Y&ab_channel=PiyushGarg has simple explaination for the above concepts
// https://blog.logrocket.com/working-with-the-javascript-reflect-api/ 
function wrap(arr) {
    return new Proxy(arr,{
      get(target, property) {
        if (property === Symbol.iterator) {
          return Reflect.get(target, property)
        }
        let index = parseInt(property, 10)
        if (index < 0) {
          index = arr.length + index
          return Reflect.get(target, index)
        } 
        return Reflect.get(target, property)
      },
      set(target, property, value) {
        let index = parseInt(property, 10)
        if (index < 0) {
          index = arr.length + index
          if (index < 0) {
            throw new Error('index out of bounds')
          }
          return Reflect.set(target, index, value)
        }
        return Reflect.set(target, property, value)
      }
    })
  }
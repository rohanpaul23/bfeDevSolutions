function curry(fn) {
    return function curried(...args){
        // Get the arguments passed to the function, there might be more arguments than the function requires
        const passedArgs =  args.slice(0, args.length)

        // Check if the arguments passed to the function include the placeholder
        const hasPlaceholder = passedArgs.includes(curry.placeholder)

        // If the arguments passed to the function are greater than or equal to the number of arguments the function requires and has no placeholders, call the function
        if(!hasPlaceholder && passedArgs.length >= fn.length){
            return fn.call(this,...passedArgs)
        }

        // If the arguments passed to the function have placeholders,replace the placeholders with the new arguments and call the function
        else {
            return function(...newArgs){
                const args = passedArgs.map(arg => arg === curry.placeholder ? newArgs.shift() : arg)
                return curried.apply(this,(args.concat(newArgs)));
            }
        }
    }
  }

  curry.placeholder = Symbol()
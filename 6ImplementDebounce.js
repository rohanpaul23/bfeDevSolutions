function debounce(func, wait) {
    let timer
    return function debounced(...args){
        if(timer){
            clearTimeout(timer)
        }
        else {
          timer = setTimeout(()=>{
            func.apply(this,args)
            },wait)
        }
    }
}
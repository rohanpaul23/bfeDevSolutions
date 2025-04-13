function sum(num){
    const func = function(newSum){
        return sum(num+newSum)
    }   
    func.valueOf = function(){
        return num;
    }
    return func;
}
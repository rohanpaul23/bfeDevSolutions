class Middleware {
    constructor(){
      this.middleWarecallbacks = []
      this.errorCallbacks = [];
      this.next = this.next.bind(this);
    }
  
    use(func) {
      if(func.length === 2){
        this.middleWarecallbacks.push(func);
      }
      else if(func.length === 3){
        this.errorCallbacks.push(func);
      }
    }
  
    start(req) {
      this.req = req;
      this.next();
    }
  
    next (err){
      let fn;
      try{
        if(err){
          fn = this.errorCallbacks.shift();
          fn(err,this.req,this.next);
        }
        else {
          fn = this.middleWarecallbacks.shift();
          fn(this.req,this.next);
        }
      }
      catch(e){
        fn = this.errorCallbacks.shift();
        fn(e,this.req,this.next);
      }
    }
  }
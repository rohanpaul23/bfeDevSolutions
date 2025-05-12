class BrowserHistory {
  
    constructor(url) {
        
      this.urls = [url];
      this.currentIndex = -1;
    }
    /**
     * @param { string } url
     */
    visit(url) {
      this.currentIndex = this.currentIndex + 1;
      this.urls[this.currentIndex] = url;
    }
    
    /**
     * @return {string} current url
     */
    get current() {
      return this.urls[this.currentIndex];
    }
    
    // go to previous entry
    goBack() {
      this.currentIndex = this.currentIndex-1;
      this.currentIndex = this.currentIndex === -1 ? this.currentIndex : Math.max(0, this.currentIndex);
    }
    
    // go to next visited url
    forward() {
      this.currentIndex = Math.min(this.urls.length - 1, this.currentIndex + 1);
    }
  }

// complete the implementation
class PriorityQueue {
  /**
   * @param {(a: any, b: any) => -1 | 0 | 1} compare - 
   * compare function, similar to parameter of Array.prototype.sort
   */
  constructor(compare) {
    this.compare = compare;
    this.heap = [];
  }

  /**
   * return {number} amount of items
   */
  size() {
    return this.heap.length;
  }

  /**
   * returns the head element
   */
  peek() {
    return this.heap[0];
  }

  /**
   * @param {any} element - new element to add
   */
  add(element) {
   this.heap.push(element);
   this._bubbleUp(this.heap.length-1);
  }

  _bubbleUp(index){
    while(index > 0){
      const parent = Math.floor((index-1)/2);

      if(this.compare(this.heap[index],this.heap[parent]) < 0){
        [this.heap[index],this.heap[parent]] = [this.heap[parent],this.heap[index]];
        index = parent;
      }
      else {
        break;
      }
    }
  }

  /**
   * remove the head element
   * @return {any} the head element
   */
  poll() {
    if(this.heap.length === 0) return undefined;
    if(this.heap.length === 1) return this.heap.pop();

    const head = this.heap[0];

    this.heap[0] = this.heap.pop();

    this._bubbleDown(0);

    return head;

  }

  _bubbleDown(index){
    const length = this.heap.length;

    while(true){
      let smallest = index;
      let leftIndex = 2 * index + 1;
      let rightIndex = 2 * index + 2;

      if(leftIndex < length && this.compare(this.heap[leftIndex],this.heap[smallest]) < 0){
        smallest = leftIndex;
      }
      if(rightIndex < length && this.compare(this.heap[rightIndex],this.heap[smallest]) < 0){
        smallest = rightIndex;
      }

      if(smallest === index) break;

      [this.heap[smallest],this.heap[index]] = [this.heap[index],this.heap[smallest]];

      index = par
    }
  }
}
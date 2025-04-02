class Queue {
  constructor() {
    this.allItems = new Stack();
  }

  enqueue(element) {
    this.allItems.push(element);
  }

  peek() {
    const reversedQueue = this._reverse(this.allItems);
    return reversedQueue.peek();
  }

  size() {
    return this.allItems.size();
  }

  dequeue() {
    const reversedQueue = this._reverse(this.allItems);
    const poppedItem = reversedQueue.pop();
    this.allItems = this._reverse(reversedQueue);
    return poppedItem;
  }
  
  _reverse(queue) {
    const reversedQueue = new Stack();
    while (queue.size() > 0) {
      const lastItem = queue.pop();
      reversedQueue.push(lastItem);
    }

    return reversedQueue;
  }
}
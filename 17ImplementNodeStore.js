class NodeStore {
    constructor() {
       this.nodes = {};
    }
   /**
   * @param {Node} node
   * @param {any} value
   */
  set(node, value) {
   node._id = Symbol();
   this.nodes[node._id] = value
  }
  /**
   * @param {Node} node
   * @return {any}
   */
  get(node) {
    return this.nodes[node._id];
  }
  
  /**
   * @param {Node} node
   * @return {Boolean}
   */
  has(node) {
    return !!this.nodes[node._id]
  }
}

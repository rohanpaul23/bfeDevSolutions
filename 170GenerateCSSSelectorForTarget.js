/**
 * generateSelector(root, target)
 *
 * This function generates a CSS selector string that uniquely identifies
 * the `target` element inside the `root` element.
 *
 * The selector is constructed as a path from root → target.
 *
 * Example DOM:
 *
 * <section>
 *   <ul>
 *     <li>Home</li>
 *     <li>Services</li>
 *     <li>Product</li>
 *   </ul>
 * </section>
 *
 * If:
 *   root   = <section>
 *   target = <li>Product</li>
 *
 * The generated selector will be:
 *
 *   "section > ul > li:nth-child(3)"
 *
 * This selector can then be used like:
 *
 *   document.querySelector(selector)
 *
 * which will return the target element.
 */

function generateSelector(root, target) {

  /**
   * `parts` will store pieces of the selector path.
   *
   * Example while building:
   * parts = [
   *   "section",
   *   "ul",
   *   "li:nth-child(3)"
   * ]
   *
   * Later we join them with " > " to form:
   *
   * section > ul > li:nth-child(3)
   */
  const parts = [];

  /**
   * Start from the target element.
   *
   * We will move upwards in the DOM tree until we reach the root.
   */
  let node = target;


  /**
   * Continue walking upward in the DOM tree
   * until we reach the root element.
   *
   * node !== root ensures we stop when we hit root.
   */
  while (node && node !== root) {

    /**
     * Get the parent element of the current node.
     *
     * Example:
     * node   = <li>
     * parent = <ul>
     */
    const parent = node.parentElement;

    /**
     * Convert the tag name to lowercase.
     *
     * DOM returns tag names in uppercase (LI, UL, SECTION)
     * but CSS selectors typically use lowercase.
     */
    const tag = node.tagName.toLowerCase();


    /**
     * If parent does not exist, break the loop.
     * (This usually means we reached the top of the DOM.)
     */
    if (!parent) break;


    /**
     * parent.children returns an HTMLCollection
     * of all ELEMENT children of the parent.
     *
     * It ignores text nodes and comments.
     *
     * Example for <ul>:
     *
     * children = [
     *   <li>Home</li>,
     *   <li>Services</li>,
     *   <li>Product</li>
     * ]
     *
     * We convert it to a real array so we can use
     * array methods like indexOf().
     */
    const siblings = Array.from(parent.children);


    /**
     * If there is ONLY ONE child under the parent,
     * then the tag name itself uniquely identifies the node.
     *
     * Example:
     *
     * <div>
     *   <ul></ul>
     * </div>
     *
     * Since there is only one <ul>, we can simply use:
     *
     *   "ul"
     */
    if (siblings.length === 1) {

      /**
       * unshift() adds elements at the BEGINNING of the array.
       *
       * We use unshift because we are building the selector
       * from bottom → top (target → root).
       *
       * Later this naturally becomes root → target order.
       */
      parts.unshift(tag);

    } else {

      /**
       * If there are multiple siblings,
       * just using the tag name would not uniquely identify the element.
       *
       * Example:
       *
       * <ul>
       *   <li>Home</li>
       *   <li>Services</li>
       *   <li>Product</li>
       * </ul>
       *
       * If target = Product, just "li" is not enough.
       *
       * We must use :nth-child(index).
       */


      /**
       * Find the index of the node among its siblings.
       *
       * indexOf returns 0-based index.
       */
      const index = siblings.indexOf(node) + 1;


      /**
       * CSS nth-child() uses 1-based indexing,
       * so we add +1.
       *
       * Example:
       *
       * siblings = [Home, Services, Product]
       *
       * indexOf(Product) = 2
       *
       * nth-child(3)
       */
      parts.unshift(`${tag}:nth-child(${index})`);
    }


    /**
     * Move one level up in the DOM tree.
     *
     * Example progression:
     *
     * li → ul → section
     */
    node = parent;
  }


  /**
   * If we successfully reached the root,
   * add the root tag to the selector.
   *
   * Example:
   * "section"
   */
  if (node === root) {
    parts.unshift(root.tagName.toLowerCase());
  }


  /**
   * Join all selector parts using " > ".
   *
   * Example:
   *
   * ["section", "ul", "li:nth-child(3)"]
   *
   * becomes
   *
   * "section > ul > li:nth-child(3)"
   */
  return parts.join(" > ");
}
/**
 * -----------------------------------------------------------------------------
 * ✅ Solution Approach (Layman Explanation)
 * -----------------------------------------------------------------------------
 *
 * We want a very small React-like system with TWO parts:
 *
 * 1) createElement(type, props, ...children)
 *    - Does NOT touch the real DOM.
 *    - It only builds a plain JavaScript object (a "virtual node") that describes:
 *        • which HTML tag to create (type)
 *        • which attributes to set (props)
 *        • what children it has (children)
 *
 *    Think of it like writing an instruction manual:
 *      "Make a <p> with class='x' and put these children inside it..."
 *
 * 2) render(vnode)
 *    - Takes that instruction object (virtual node tree)
 *    - Actually creates real DOM nodes using browser APIs:
 *        • document.createElement(tag)
 *        • document.createTextNode(text)
 *    - Applies props onto the element
 *    - Recursively renders all children and appends them
 *
 * -----------------------------------------------------------------------------
 * ✅ Virtual Node Format We Use
 * -----------------------------------------------------------------------------
 * {
 *   type: "div",           // HTML tag name (string)
 *   props: { ... },        // camelCased attributes like className, href, tabIndex
 *   children: [ ... ]      // array of strings (TextNodes) or MyElement objects
 * }
 *
 * -----------------------------------------------------------------------------
 * ✅ Why we flatten children?
 * -----------------------------------------------------------------------------
 * Children can sometimes come in nested arrays (e.g. from conditionals or map()).
 * To simplify rendering, we flatten everything into ONE array.
 *
 * We also ignore:
 * - null / undefined / false  (these mean "render nothing")
 * And we convert numbers into strings (so they become text nodes).
 * -----------------------------------------------------------------------------
 */


/**
 * MyElement is the type your implementation supports
 *
 * type MyNode = MyElement | string
 */


/**
 * createElement()
 * -----------------------------------------------------------------------------
 * Creates a "virtual node" object (like React.createElement), NOT a DOM element.
 *
 * @param { string } type - valid HTML tag name (ex: "div", "p", "a")
 * @param { object } [props] - element attributes/props (camelCased)
 * @param { ...MyNode } [children] - children passed as rest args
 * @return { MyElement } - our virtual node object
 */
function createElement(type, props, ...children) {
  // We will collect all children into this single flat array.
  const flatChildren = [];

  /**
   * pushChild()
   * - Flattens nested arrays
   * - Skips "empty" children (null/undefined/false)
   * - Converts numbers to strings (text nodes)
   * - Pushes valid children (string or vnode object) into flatChildren
   */
  const pushChild = (c) => {
    // If a child is an array, recursively push each element (flattening).
    if (Array.isArray(c)) {
      for (const x of c) pushChild(x);
      return; // done
    }

    // Ignore "empty" children: React also treats these as "render nothing".
    if (c === null || c === undefined || c === false) return;

    // If child is a number, convert it to string so it becomes a text node.
    if (typeof c === "number") {
      flatChildren.push(String(c));
      return;
    }

    // For this problem, valid children are:
    // - string (text node)
    // - vnode object (element)
    flatChildren.push(c);
  };

  // Process each rest-argument child and push it in normalized form.
  for (const c of children) pushChild(c);

  // Return the virtual node object (our "instruction" for the DOM).
  return {
    type,               // ex: "div", "p", "a"
    props: props || {}, // ensure props is always an object
    children: flatChildren, // always store children as a flat array
  };
}


/**
 * render()
 * -----------------------------------------------------------------------------
 * Converts a virtual node tree into REAL DOM nodes.
 *
 * @param { MyElement | string } vnode - virtual node object OR string text
 * @returns { Node } - real DOM node (HTMLElement or Text node)
 */
function render(vnode) {
  // -------------------------
  // 1) If vnode is a string => create a Text node
  // -------------------------
  if (typeof vnode === "string") {
    // Turn "hello" into an actual DOM Text node.
    return document.createTextNode(vnode);
  }

  // -------------------------
  // 2) Validate vnode object shape
  // -------------------------
  if (!vnode || typeof vnode !== "object" || typeof vnode.type !== "string") {
    // If vnode is not a valid virtual element object, throw an error.
    throw new TypeError("render() expects a vnode object or string");
  }

  // Extract tag name, props, and children from the virtual node.
  const { type, props, children } = vnode;

  // -------------------------
  // 3) Create the real DOM element
  // -------------------------
  // Example: type = "div" => <div></div>
  const el = document.createElement(type);

  // -------------------------
  // 4) Apply props onto the DOM element
  // -------------------------
  // props contains camelCased HTML attributes like:
  // { className: "paragraph", href: "https://..." }
  for (const [key, value] of Object.entries(props || {})) {
    // Skip props that mean "do not set anything"
    if (value === null || value === undefined || value === false) continue;

    // Special case: className should become HTML attribute "class"
    if (key === "className") {
      el.setAttribute("class", String(value));
      continue; // done with this prop
    }

    // Prefer setting as a DOM property when it exists (more correct for many props).
    // Example: el.href = "...", el.tabIndex = 0, el.value = "x"
    if (key in el) {
      el[key] = value;
    } else {
      // Otherwise set it as an HTML attribute (useful for data-* and aria-* attributes).
      el.setAttribute(key, String(value));
    }
  }

  // -------------------------
  // 5) Render and append children
  // -------------------------
  // children is an array of:
  // - strings (text nodes)
  // - virtual node objects (elements)
  for (const child of children || []) {
    // Render the child recursively, then append its DOM node to this element.
    el.appendChild(render(child));
  }

  // Return the fully constructed DOM element subtree.
  return el;
}

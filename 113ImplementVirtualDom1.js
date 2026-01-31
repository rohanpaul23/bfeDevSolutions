/**
 * -----------------------------------------------------------------------------
 * DOM ⇄ Object Literal Serialization (React-like "Virtual DOM" idea)
 * -----------------------------------------------------------------------------
 *
 * ✅ What problem are we solving?
 * Browsers render HTML by turning it into a DOM tree (real nodes in memory).
 * React (and similar libraries) often represent UI as a plain JavaScript object
 * tree first (a "virtual" representation), then create/patch real DOM from it.
 *
 * This exercise implements a simplified version of that:
 *
 * 1) virtualize(realDomElement)  -> converts a real DOM subtree into an object tree
 * 2) render(objectTree)          -> converts the object tree back into real DOM nodes
 *
 * -----------------------------------------------------------------------------
 * ✅ Our object format
 * Each HTML element becomes:
 *
 * {
 *   type: "tagname",          // e.g. "div", "p", "a"
 *   props: {
 *     ...attributes,          // e.g. className, href, tabIndex
 *     children: ...           // either a single child or an array of children
 *   }
 * }
 *
 * Children rules (React-like):
 * - Text nodes are stored as plain strings (e.g. "hello")
 * - If there is 1 child, props.children is that single child (string or object)
 * - If there are multiple children, props.children is an array
 * - If there are no children, props.children is omitted
 *
 * -----------------------------------------------------------------------------
 * ✅ Why do we need name conversion (class -> className, tabindex -> tabIndex)?
 * HTML attributes are typically lowercase/kebab-case.
 * DOM/JS properties are often camelCase, and some names are special:
 * - "class" in HTML maps to "className" in JS
 * - "for" maps to "htmlFor"
 * - "tabindex" maps to "tabIndex"
 *
 * So:
 * - During virtualize(): attribute names -> JS-friendly prop names
 * - During render(): prop names -> proper HTML attribute names (when needed)
 *
 * -----------------------------------------------------------------------------
 * ✅ Key limitations (per prompt)
 * - Only basic HTML tags + attributes
 * - No event handlers, no functions, no custom components
 * - Ignore comments and other non-element nodes
 * -----------------------------------------------------------------------------
 */


/**
 * Convert kebab-case attribute names into camelCase prop names.
 * Example:
 * - "data-id"    -> "dataId"
 * - "aria-label" -> "ariaLabel"
 */
function toCamelCase(name) {
  // Replace "-x" with "X" (uppercase), so kebab-case becomes camelCase.
  return name.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
}

/**
 * Some HTML attribute names do NOT convert correctly using simple camelCase rules.
 * So we keep an explicit mapping for those special cases when converting:
 * HTML attribute name -> JS/React-style prop name
 */
const ATTR_TO_PROP = {
  class: "className",      // HTML "class" should become JS "className"
  for: "htmlFor",          // HTML "for" should become JS "htmlFor"
  tabindex: "tabIndex",    // HTML "tabindex" should become JS "tabIndex"
  readonly: "readOnly",    // HTML "readonly" should become JS "readOnly"
};

/**
 * The reverse mapping for render():
 * JS/React-style prop name -> HTML attribute name
 * (Used when we must call setAttribute, or for correctness/consistency.)
 */
const PROP_TO_ATTR = {
  className: "class",
  htmlFor: "for",
  tabIndex: "tabindex",
  readOnly: "readonly",
};


/**
 * -----------------------------------------------------------------------------
 * virtualize(element)
 * -----------------------------------------------------------------------------
 * Takes a REAL DOM element (HTMLElement) and converts it into our object format.
 *
 * - Reads element attributes and stores them in props (camelCased).
 * - Reads children:
 *    - Text nodes become strings
 *    - Element nodes become nested objects via recursion
 * - Applies "children" normalization:
 *    - 1 child  -> props.children = that child
 *    - many     -> props.children = [ ...children ]
 *    - 0        -> no props.children
 *
 * @param {HTMLElement} element - real DOM element (e.g. document.querySelector(...))
 * @return {object} object literal presentation of the DOM subtree
 */
function virtualize(element) {
  // Create the props object that will hold attributes + children.
  const props = {};

  // Loop over all attributes on the element (e.g. class, href, tabindex).
  for (let attr of element.attributes) {
    // Convert attribute name to a JS-friendly prop name:
    // - Use explicit special mapping if present, else camelCase it.
    const propName = ATTR_TO_PROP[attr.name] || toCamelCase(attr.name);

    // Store attribute value in props (attributes are strings in HTML).
    props[propName] = attr.value;
  }

  // We'll collect child representations in an array first.
  const children = [];

  // Loop over all childNodes (includes text nodes + element nodes).
  for (let node of element.childNodes) {
    // If the child is a text node...
    if (node.nodeType === Node.TEXT_NODE) {
      // Push its text as a string (React-style text child).
      children.push(node.textContent);
    }
    // If the child is a normal element node...
    else if (node.nodeType === Node.ELEMENT_NODE) {
      // Recursively virtualize the child element and push the object.
      children.push(virtualize(node));
    }
    // Otherwise (comment nodes, etc.), ignore — out of scope.
    else {
      // no-op
    }
  }

  // Normalize children shape:
  // If exactly one child, store as single value (not array) for React-like behavior.
  if (children.length === 1) props.children = children[0];
  // If more than one, store as an array.
  else if (children.length > 1) props.children = children;

  // Return the final object representation for this element.
  return {
    // Tag name in lowercase to normalize (e.g. "DIV" -> "div")
    type: element.tagName.toLowerCase(),
    // Props includes attributes + (optional) children
    props,
  };
}


/**
 * -----------------------------------------------------------------------------
 * render(obj)
 * -----------------------------------------------------------------------------
 * Takes an object literal representation and builds REAL DOM nodes from it.
 *
 * - If obj is a string/number -> create a Text node
 * - If obj is an element object:
 *    - create the element via document.createElement(type)
 *    - apply attributes/props
 *    - recursively render children and append them
 *
 * NOTE: This returns a Node (could be HTMLElement or Text).
 *
 * @param {object|string|number} obj - virtual node OR text
 * @return {Node} real DOM node (HTMLElement or Text)
 */
function render(obj) {
  // ----- Case 1: Text node -----
  // In our virtual format, text children are plain strings (or numbers).
  if (typeof obj === "string" || typeof obj === "number") {
    // Create a real DOM text node from the value.
    return document.createTextNode(String(obj));
  }

  // Basic validation: must be an object for element nodes.
  if (!obj || typeof obj !== "object") {
    // Throw a clear error if input is invalid.
    throw new TypeError("render() expects a valid virtual node or string");
  }

  // Extract type (tag) and props (attributes + children) from the object.
  const { type, props = {} } = obj;

  // Separate children from the rest of props (attrs).
  // children will be rendered recursively; attrs will be applied to the node.
  const { children, ...attrs } = props;

  // Create the real DOM element, e.g. "div" -> <div></div>.
  const node = document.createElement(type);

  // ----- Apply attributes/props -----
  // Loop through each attribute-like prop in attrs.
  for (let [prop, value] of Object.entries(attrs)) {
    // Convert special prop names back to proper HTML attribute names if needed.
    // Example: className -> class
    const attrName = PROP_TO_ATTR[prop] || prop;

    // Skip null/undefined/false:
    // - null/undefined means "do not set"
    // - false often means "remove/ignore" (React-like behavior)
    if (value == null || value === false) continue;

    // Prefer setting as a DOM property when possible.
    // Example: node.className = "x", node.href = "...", node.tabIndex = 1
    if (prop in node) {
      // Set property directly (often more correct than setAttribute).
      node[prop] = value;
    } else {
      // If the DOM property doesn't exist, set as an HTML attribute.
      // Example: data-* or aria-* attributes
      node.setAttribute(attrName, String(value));
    }
  }

  // ----- Append children -----
  // children might be:
  // - undefined (no children)
  // - a single child (string or object)
  // - an array of children
  if (children !== undefined) {
    // Normalize to array so we can loop consistently.
    const childrenArr = Array.isArray(children) ? children : [children];

    // Render and append each child.
    for (let child of childrenArr) {
      // Skip null/undefined children entries (defensive).
      if (child === undefined || child === null) continue;

      // Recursively render the child and append to the current node.
      node.appendChild(render(child));
    }
  }

  // Return the fully built DOM node (element).
  return node;
}

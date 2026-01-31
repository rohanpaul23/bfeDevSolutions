/**
 * -----------------------------------------------------------------------------
 * ✅ Approach (Problem 119: Support Functional Components)
 * -----------------------------------------------------------------------------
 *
 * In Virtual DOM II (problem 118), `type` was only an HTML tag name (string),
 * like "div", "p", "a".
 *
 * Now `type` can also be a Functional Component:
 *   - a function that accepts ONE argument: props object
 *   - props contains all attributes + `children`
 *   - returns a MyElement (virtual node) by calling createElement()
 *
 * Example:
 *   const Title = ({ children, ...rest }) => h("h1", rest, ...children)
 *
 * So we modify render() to do:
 *   if vnode.type is a function:
 *      1) build propsForComponent = { ...props, children: vnode.children }
 *      2) call component => returns another vnode (usually intrinsic tags)
 *      3) render that returned vnode recursively
 *
 * createElement() mostly stays the same — it just needs to allow `type` to be
 * a function as well.
 * -----------------------------------------------------------------------------
 */


/**
 * createElement()
 * - Supports:
 *    type: string (intrinsic HTML tag) OR function (Functional Component)
 * - Returns a virtual node object, not real DOM.
 */
function createElement(type, props, ...children) {
  const flatChildren = [];

  // Flatten nested child arrays + ignore empty children + convert numbers to strings
  const pushChild = (c) => {
    if (Array.isArray(c)) {
      for (const x of c) pushChild(x);
      return;
    }
    if (c === null || c === undefined || c === false) return;
    if (typeof c === "number") {
      flatChildren.push(String(c));
      return;
    }
    flatChildren.push(c); // string or vnode object
  };

  for (const c of children) pushChild(c);

  return {
    type,               // "div" OR TitleComponentFunction
    props: props || {}, // attributes only (children stored separately)
    children: flatChildren,
  };
}


/**
 * render()
 * - Supports:
 *    vnode: string  -> Text node
 *    vnode: MyElement with:
 *      - type = function => Functional Component
 *      - type = string   => intrinsic HTML element
 *
 * @returns {Node} HTMLElement or Text node
 */
function render(vnode) {
  // 1) Text node
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  // 2) Validate vnode
  if (!vnode || typeof vnode !== "object") {
    throw new TypeError("render() expects a vnode object or string");
  }

  const { type, props = {}, children = [] } = vnode;

  // 3) Functional Component support:
  // If `type` is a function, call it to get the "real" vnode, then render that.
  if (typeof type === "function") {
    // Components expect children inside props as an array.
    const propsForComponent = { ...props, children };

    // Call the component function (it returns a vnode created by createElement)
    const returnedVnode = type(propsForComponent);

    // Render what the component returned
    return render(returnedVnode);
  }

  // 4) Intrinsic element (type must be a string)
  if (typeof type !== "string") {
    throw new TypeError("vnode.type must be a string tag or a function component");
  }

  const el = document.createElement(type);

  // Apply props / attributes
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    // Special-case: className -> class
    if (key === "className") {
      el.setAttribute("class", String(value));
      continue;
    }

    // Prefer DOM property if present, else setAttribute
    if (key in el) {
      el[key] = value;
    } else {
      el.setAttribute(key, String(value));
    }
  }

  // Render + append children
  for (const child of children) {
    el.appendChild(render(child));
  }

  return el;
}


// --------------------
// ✅ Example usage
// --------------------
const h = createElement;

const Title = ({ children, ...rest }) => h("h1", rest, ...children);

const dom1 = render(h(Title, {}, "This is a title"));
const dom2 = render(h(Title, { className: "class1" }, "This is a title"));

// document.body.append(dom1, document.createElement("hr"), dom2);

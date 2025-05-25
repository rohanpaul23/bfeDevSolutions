function virtualize(element) {
  const props = {}
  for(let attr of element.attributes){
    const name = attr.name === 'class' ? 'className' : attr.name;
    props[name] = attr.value;
  }
  const children = [];
  for(let node of element.childNodes){
    if(node.nodeType === 3){
       children.push(node.textContent);
    }
    else {
       children.push(virtualize(node));
    }
  }
  props.children = children.length === 1 ? children[0] : children;
  return {
    type: element.tagName.toLowerCase(),
    props
  }
}

function render(obj){
    if(typeof obj === 'string'){
       return document.createTextNode(obj);
    }
    const { type, props: { children, ...attrs } } = obj;
    const node = document.createElement(type);
    for (let [attr, value] of Object.entries(attrs)) {
        node[attr] = value;
    }
    const childrenArr = Array.isArray(children) ? children : [children];
    for (let child of childrenArr) {
        node.append(render(child));
    }
    return node;
}
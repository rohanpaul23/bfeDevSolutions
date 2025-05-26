function generateSelector(root, target) {
  let current = target;
  let result = "";
  while(current !== root){
    result = `> ${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ""} ${result}`
    current = current.parentElement;
  }
  return `${root.tagName.toLowerCase()} ${result}`;
}
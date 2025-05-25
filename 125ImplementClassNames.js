function classNames(...args) {
  let op = "";

  for (let item of args) {
    if (item === null || typeof item === "symbol") {
    } else if (typeof item === "string" || typeof item === "number")
      op += `${item} `;
    else if (Array.isArray(item)) {
      item.flat(Infinity).forEach((elem) => args.push(elem));
    } else if (typeof item === "object") {
      Object.keys(item).forEach((elem) => {
        if (item[elem]) op += `${elem} `;
      });
    }
  }
  return op.trim();
}

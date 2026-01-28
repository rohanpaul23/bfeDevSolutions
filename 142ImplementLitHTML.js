
function html(strings, ...values) {
  // Interleave strings and values:
  // strings: ["<div>Hello ", "!</div>"]
  // values:  ["Steve"]
  let out = "";

  for (let i = 0; i < strings.length; i++) {
    out += strings[i];

    // values array is one shorter than strings array, so guard
    if (i < values.length) {
      out += String(values[i]);
    }
  }

  return out;
}

/**
 * Renders the HTML string into a container element.
 * For this simplified problem, we always replace innerHTML.
 *
 * @param {string} result - output from html()
 * @param {HTMLElement} container
 */
function render(result, container) {
  container.innerHTML = result;
}


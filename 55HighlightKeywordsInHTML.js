function highlightKeywords(html, keywords) {
    const uniqueKeywords = new Set(keywords);

  const words = html.split(" ");

  const hasWord = (word) => {
    return uniqueKeywords.has(word);
  };

  const result = words.map((word) => {
    let output = "";

    if (hasWord(word)) {
      output = `<em>${word}</em>`;
    } else {
      for (let i = 0; i < word.length; i++) {
        const prefix = word.slice(0, i + 1);
        const suffix = word.slice(i + 1);

        if (hasWord(prefix) && hasWord(suffix)) {
          output = `<em>${prefix + suffix}</em>`;
        } else if (hasWord(prefix) && !hasWord(suffix)) {
          output = `<em>${prefix}</em>${suffix}`;
        } else if (hasWord(suffix) && !hasWord(prefix)) {
          output = `${prefix}<em>${suffix}</em>`;
        }
      }
    }

    return output !== "" ? output : word;
  });

  return result.join(" ");
}   

const html = "Hello FrontEnd Lovers"
const keywords = ['Hello', 'Front', 'JavaScript']

highlightKeywords(html,keywords)


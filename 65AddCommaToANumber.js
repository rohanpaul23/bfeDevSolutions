
/**
 * @param {number} num
 * @return {string}
 */
function addComma(num) {
   if (num === null || num === undefined || num === "") return "";

  // Convert to string
  let str = String(num);

  // Handle negative numbers
  const isNegative = str.startsWith("-");
  if (isNegative) str = str.slice(1);

  // Split integer and decimal parts
  const [integerPart, decimalPart] = str.split(".");

  // Convert integer part to array
  const digits = integerPart.split("");
  const result = [];

  // Add commas manually every 3 digits from right
  let count = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    result.unshift(digits[i]);
    count++;
    if (count === 3 && i !== 0) {
      result.unshift(",");
      count = 0;
    }
  }

  // Combine integer and decimal
  let formatted = result.join("");
  if (decimalPart) formatted += "." + decimalPart;
  if (isNegative) formatted = "-" + formatted;

  return formatted;
}

console.log(addComma(12345678.12345))
console.log(addComma(-12345678))
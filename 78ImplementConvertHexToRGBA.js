/**
 * Convert a hex color string into CSS functional rgba(...) notation.
 *
 * Why only lengths 3, 4, 6, 8?
 * - Each color channel is 1 byte (0..255) => represented by 2 hex digits.
 * - RGB uses 3 channels => 3 * 2 = 6 digits.
 * - RGBA adds an alpha channel => 4 * 2 = 8 digits.
 * - "#RGB" is a CSS shorthand where each digit expands (e.g. "f" -> "ff").
 * - "#RGBA" is shorthand for "#RRGGBBAA".
 * - Other lengths (2,5,7,9...) do not map cleanly to complete color channels.
 *
 * Alpha formatting:
 * - If alpha is present (#RGBA or #RRGGBBAA), we compute:
 *     alpha = AA / 255   → value in range [0, 1]
 * - Alpha must have at most 2 digits after the decimal point.
 * - We round to 2 decimals using standard rounding.
 *
 * Input validation:
 * - Input must be a string.
 * - Optional leading '#'.
 * - Length must be 3, 4, 6, or 8 after removing '#'.
 * - Only hexadecimal characters are allowed: [0-9a-fA-F].
 * - Invalid input throws an Error (fail fast).
 *
 * @param {string} hex
 * @return {string} rgba(...) string
 * @throws {Error} on invalid input
 */
function hexToRgba(hex) {
  if (typeof hex !== "string") {
    throw new Error("Input must be a string");
  }

  // Remove leading '#'
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }

  // Validate length
  if (![3, 4, 6, 8].includes(hex.length)) {
    throw new Error("Invalid hex color length");
  }

  // Validate characters
  if (!/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error("Invalid hex characters");
  }

  let r, g, b, a = 1;

  // Shorthand forms (#RGB, #RGBA)
  if (hex.length === 3 || hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);

    if (hex.length === 4) {
      a = parseInt(hex[3] + hex[3], 16) / 255;
    }
  }

  // Full forms (#RRGGBB, #RRGGBBAA)
  if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);

    if (hex.length === 8) {
      a = parseInt(hex.slice(6, 8), 16) / 255;
    }
  }

  // Round alpha to max 2 decimal places
  a = Math.round(a * 100) / 100;

  return `rgba(${r},${g},${b},${a})`;
}

/**
 * Renders a plain text string into HTML by converting mentions (@username)
 * and URLs into clickable <a> links.
 *
 * Example:
 *   Input text: "Hello @rohan check this out https://example.com"
 *   Output: "Hello <a href='https://x.com/rohan'>@rohan</a> check this out <a href='https://example.com'>example.com</a>"
 *
 * @param text - The input text containing mentions and URLs.
 * @param entities - An object describing which mentions and URLs exist in the text.
 *   {
 *     mentions: Array<{ screenName: string }>
 *     urls: Array<{ url: string, displayUrl: string }>
 *   }
 * @returns The HTML string with <a> tags replacing mentions and URLs.
 */
function renderTextWithEntities(text: string, entities: Entities): string {
  // Initialize the result string with the original text
  let result = text;

  // Replace all @mentions with clickable profile links
  // Example: @rohan → <a href="https://x.com/rohan">@rohan</a>
  entities.mentions.forEach((mention) => {
    // Note: there's a small typo in your original code: "screeName" → "screenName"
    result = result.replace(
      `@${mention.screenName}`,
      `<a href="https://x.com/${mention.screenName}">@${mention.screenName}</a>`
    );
  });

  // Replace all URLs with clickable anchor links
  // Example: https://example.com → <a href="https://example.com">example.com</a>
  entities.urls.forEach((url) => {
    result = result.replace(
      url.url,
      `<a href="${url.url}">${url.displayUrl}</a>`
    );
  });

  // Return the final HTML string with all replacements applied
  return result;
}

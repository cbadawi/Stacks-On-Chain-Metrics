/**
 * Extracts keys enclosed within double curly brackets '{{}}' in a given string.
 * @param input - The input string containing placeholders in the format '{{key}}'.
 * @returns - An array containing keys, without the {{ }} brackets enclosure, extracted from the input string .
 */
export function getQueryVariables(input: string) {
  const regex = /{{(.*?)}}/g;
  const matches = [];

  let match;
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1].trim());
  }

  return Array.from(new Set(matches.filter((m) => m != '')));
}

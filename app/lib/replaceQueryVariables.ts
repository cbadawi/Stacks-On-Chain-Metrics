/**
 * Replaces placeholder strings enclosed within double curly brackets in the input string.
 *
 * @param query - The input string containing placeholder strings.
 * @param replacements - An object where keys are {{placeholder}} names and values are replacements.
 * @returns - The input string with placeholder strings replaced by their corresponding values.
 */
export function replaceQueryVariables(
  query: string,
  replacements: Record<string, string>
) {
  let replacedString = query;
  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    replacedString = replacedString.replace(regex, replacements[key]);
  });
  return replacedString;
}

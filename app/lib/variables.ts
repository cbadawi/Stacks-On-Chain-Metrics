/**
 * Extracts keys enclosed within double curly brackets '{{}}' in a given string.
 * @param input - The input string containing placeholders in the format '{{key}}'.
 * @returns - An array containing keys, without the {{ }} brackets enclosure, extracted from the input string .
 */
export function getQueryVariableNames(input: string) {
  const regex = /{{(.*?)}}/g;
  const matches = [];

  let match;
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1].trim());
  }

  return Array.from(new Set(matches.filter((m) => m != '')));
}

export function replaceVariables(
  query: string,
  variablesList: Record<string, string> = {}
) {
  const keys = Object.keys(variablesList);
  keys.forEach((key) => {
    query = replaceVariable(query, key, variablesList[key]);
  });
  console.log('replaceVariables', { query, variablesList, keys });
  return query;
}

export const replaceVariable = (
  query: string,
  variable: string,
  value: any
) => {
  const regex = new RegExp(`{{${variable}}}`, 'g');
  const valueWithQuotes = `'` + value + `'`; // put quotes around contracts for ex 'SP3...'. if not, pg considers them an entity
  query = query.replace(regex, valueWithQuotes);
  return query;
};

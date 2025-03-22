export function seperatePromptFromSql(input: string) {
  let prompt = '';
  let query = '';

  const lines = input.split('\n');
  for (const line of lines) {
    if (findIsAIPrompt(line)) {
      if (query) continue; // stop building the prompt on the first line without a comment block
      prompt += line
        .trim()
        // .toLowerCase()
        .replace(/--\s?ai?/gi, '');
    } else {
      query += line.replace(/\t/g, ' ') + ' \n';
    }
  }

  return { prompt: prompt.trim(), sql: query.trim() };
}

export const wrapQueryLimit = (query: string) =>
  `WITH user_query AS (
    ${query}
    ) SELECT * FROM user_query LIMIT 100;`;
export const cleanQuery = (query: string) => query.replaceAll(';', ' ');

export const findIsAIPrompt = (query: string) =>
  query.slice(0, 5).toLowerCase() === '-- ai' ||
  query.slice(0, 4).toLowerCase() === '--ai';

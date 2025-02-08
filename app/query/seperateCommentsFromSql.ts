export function seperateCommentsFromSql(input: string) {
  let prompt = '';
  let query = '';

  const lines = input.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('--')) {
      prompt += line.trim().slice(2) + ' ';
    } else {
      query += line.replace(/\t/g, ' ') + ' ';
    }
  }

  return { prompt: prompt.trim(), sql: query.trim() };
}

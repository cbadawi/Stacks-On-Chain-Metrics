export const findIsAIPrompt = (query: string) =>
  query.slice(0, 5).toLowerCase() === '-- ai' ||
  query.slice(0, 4).toLowerCase() === '--ai';

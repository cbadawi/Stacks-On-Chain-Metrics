import { VariableType, replaceVariable } from '@/app/components/helpers';

export function replaceVariables(
  query: string,
  variablesList: Record<string, string> = {}
) {
  const keys = Object.keys(variablesList);
  keys.forEach((key) => {
    query = replaceVariable(query, key, variablesList[key]);
  });
  return query;
}

import { VariableType, replaceVariable } from '@/app/components/helpers';

export function replaceVariables(
  query: string,
  variablesList: VariableType[] = []
) {
  variablesList.forEach((variableObj) => {
    query = replaceVariable(
      query,
      variableObj.variable,
      variableObj.value.toString()
    );
  });
  return query;
}

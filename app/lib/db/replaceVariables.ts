import { VariableType } from '@/app/components/helpers';

export function replaceVariables(
  query: string,
  variablesList: VariableType[] = []
) {
  variablesList.forEach((variableObj) => {
    const regex = new RegExp(`{{${variableObj.variable}}}`, 'g');
    query = query.replace(regex, variableObj.value.toString());
  });
  return query;
}

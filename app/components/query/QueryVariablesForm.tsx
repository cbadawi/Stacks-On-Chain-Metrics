import { getQueryVariableNames } from '@/app/lib/variables';
import React from 'react';
import Variable from './Variable';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface QueryVariablesFormProps {
  query: string;
}

const QueryVariablesForm = ({ query }: QueryVariablesFormProps) => {
  const variables = getQueryVariableNames(query);
  if (!variables.length) return;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Query Variables</CardTitle>
        <CardDescription>
          Parameterize your SQL queries. You can define variables by wrapping
          filters in double brackets {'{{}}'}.
        </CardDescription>
      </CardHeader>
      <div className='w-full p-2 lg:mx-auto'>
        {/* <div className='header p-2'>Filters</div> */}
        <form action='' className='flex flex-wrap gap-4 whitespace-nowrap'>
          {variables.map((variable, index) => {
            const inputPlaceholder = 'Enter Value'; //+ variable;
            return (
              <Variable
                key={index.toString()}
                inputPlaceholder={inputPlaceholder}
                variable={variable}
              />
            );
          })}
        </form>
      </div>
    </Card>
  );
};

export default QueryVariablesForm;

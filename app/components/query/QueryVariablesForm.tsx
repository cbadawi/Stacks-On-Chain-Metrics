import { getQueryVariables } from '@/app/lib/getQueryVariables';
import React from 'react';
import Variable from './Variable';

interface QueryVariablesFormProps {
  query: string;
}

// design inspired by dune https://dune.com/defimochi/token-god-mode
// https://dune.com/queries/3262152

const QueryVariablesForm = ({ query }: QueryVariablesFormProps) => {
  const variables = getQueryVariables(query);
  if (!variables.length) return;

  return (
    <div className='w-full p-2 lg:mx-auto'>
      {/* <div className='header p-2'>Filters</div> */}
      <form action='' className='flex flex-wrap gap-4 whitespace-nowrap'>
        {variables.map((variable) => {
          const inputPlaceholder = 'Enter Value'; //+ variable;
          return (
            <Variable inputPlaceholder={inputPlaceholder} variable={variable} />
          );
        })}
      </form>
    </div>
  );
};

export default QueryVariablesForm;

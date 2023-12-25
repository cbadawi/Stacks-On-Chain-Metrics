import { getQueryVariables } from '@/app/lib/getQueryVariables';
import React from 'react';

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
        {variables.map((variable, index) => {
          const inputPlaceholder = 'Enter Value'; //+ variable;
          const inputClassname = `variable-input ${variable} bg-[#18191e]`;
          return (
            <div
              key={`div-${index}`}
              className='filter-wrap overflow-auto rounded-3xl border-2 border-[#ccc] bg-[#18191e] px-3 py-2 text-gray-300'
            >
              <label key={`label-${index}`}>{variable} </label>
              <input
                key={`variable-input-${variable}-${index}`}
                className={inputClassname}
                placeholder={inputPlaceholder}
              ></input>
            </div>
          );
        })}
      </form>
    </div>
  );
};

export default QueryVariablesForm;

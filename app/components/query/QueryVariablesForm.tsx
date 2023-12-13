import { getQueryVariables } from '@/app/lib/getQueryVariables';
import { replaceQueryVariables } from '@/app/lib/replaceQueryVariables';
import React from 'react';

interface QueryVariablesFormProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  runQuery: (query: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

// design inspired by dune https://dune.com/defimochi/token-god-mode
// https://dune.com/queries/3262152

const QueryVariablesForm = ({
  query,
  setQuery,
  runQuery,
  setError,
}: QueryVariablesFormProps) => {
  const variables = getQueryVariables(query);
  if (!variables.length) return;

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    let replacementsMap: Record<string, string> = {};
    variables.map((v, index) => {
      const element = e.target.elements[index] as HTMLInputElement;
      const variableNameFromClass = element.className.split(' ')[0];
      const value = element.value;
      value
        ? (replacementsMap[v] = value)
        : setError(`Variable "${v}" not set.`);
    });
    // if variables.map fails to add a var to replacementsMap, do not run query.
    if (Object.keys(replacementsMap).length < variables.length) return;
    const newQuery = replaceQueryVariables(query, replacementsMap);
    // setQuery(newQuery); // Do not setQuery, this will substitute the variable inplace
    runQuery(newQuery);
  };
  return (
    <div className='w-[97%] bg-[#18191e] lg:mx-auto '>
      <div className='header'>Filter</div>
      <form
        onSubmit={handleFormSubmit}
        action=''
        className='flex flex-wrap whitespace-nowrap'
      >
        {variables.map((variable, index) => {
          const inputPlaceholder = 'Enter Value'; //+ variable;
          const inputClassname = `${variable} bg-[#18191e]`;
          return (
            <div
              key={`div-${index}`}
              className='filter-wrap overflow-auto rounded-3xl border-2 border-[#ccc] bg-[#18191e] px-3 py-2 text-gray-300'
            >
              <label key={`label-${index}`}>{variable} </label>
              <input
                key={`input-${variable}-${index}`}
                className={inputClassname}
                placeholder={inputPlaceholder}
              ></input>
            </div>
          );
        })}
        <button type='submit'>Save</button>
      </form>
    </div>
  );
};

export default QueryVariablesForm;

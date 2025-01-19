'use client';

import React, { useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryErrorContainer from '../components/QueryErrorContainer';
// import QueryVisualization from '../components/query/QueryVisualization';
import StarterPlaceholderMessage from '../components/query/StarterPlaceholderMessage';
import { VariableType, replaceVariable } from '../components/helpers';
import { ChartType, CustomizableChartTypes, LeftRight } from '@prisma/client';
import QueryVisualization from '../components/query/QueryVisualization';
import { fetchData } from './actions';

const DEFAULT_QUERY = `-- PostgreSQL 15
-- Press Ctrl+Enter to run
-- You can use variables by wrapping words in double brackets {{}}
select 1 aaa, 3 sa, 8 da, 5 ads
union select 7,5,3,1`;
// TODO change default query to something more recent

const QueryWrapper = () => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // array containing the type of column. ex ['bar', 'bar', 'line']
  const [chartColumnsTypes, setChartColumnsTypes] = useState<
    CustomizableChartTypes[]
  >([]);
  // array containing the position of axis.
  const [chartAxesTypes, setChartAxesTypes] = useState<LeftRight[]>([]);
  const [data, setData] = useState<any[] | undefined | never[]>([]);
  const [variableDefaults, setVariableDefaults] = useState<VariableType[]>([]);

  const replaceVariables = (
    query: string,
    errorHandler?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const inputElements = document.getElementsByClassName('variable-input');
    const variablesList: VariableType[] = [];
    const res = Array.from(inputElements).every((element) => {
      const variable = element.className.split(' ')[1];
      const value = (element as HTMLButtonElement).value;
      if (!value) {
        errorHandler && errorHandler(`Variable "${variable}" not set.`);
        return false;
      }
      query = replaceVariable(query, variable, value);
      variablesList.push({ variable, value });
      return true;
    });
    setVariableDefaults(variablesList);
    return res ? query : '';
  };

  const runQuery = async (query: string) => {
    setIsLoading(true);
    setData([]);
    setVariableDefaults([]);
    setError('');
    const queryWithVariables = replaceVariables(query, setError);

    if (queryWithVariables) {
      // const response = await fetchData(queryWithVariables, setError);
      try {
        const response = await fetchData(queryWithVariables);

        console.log('runquery', { response });
        setData(response.data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className='query-wrapper'>
      <div className='editor-wrapper relative mx-auto mb-4 mt-10 flex w-[95%] items-center justify-center'>
        <SqlEditor
          query={query}
          setQuery={setQuery}
          setError={setError}
          isLoading={isLoading}
          runQuery={runQuery}
        />
      </div>
      <>{JSON.stringify({ data })}</>
      <div>
        {error && <QueryErrorContainer error={error} setError={setError} />}
        <div className='relative my-12 h-auto rounded-t-3xl bg-[#081115]  px-0 py-4 '>
          {!data?.length ? (
            <StarterPlaceholderMessage />
          ) : (
            <>
              <QueryVisualization
                data={data}
                query={query}
                chartColumnsTypes={chartColumnsTypes}
                setChartColumnsTypes={setChartColumnsTypes}
                chartAxesTypes={chartAxesTypes}
                setChartAxesTypes={setChartAxesTypes}
                errorHandler={setError}
                error={error}
                variableDefaults={variableDefaults}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryWrapper;

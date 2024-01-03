'use client';

import React, { useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryErrorContainer from '../components/QueryErrorContainer';
import QueryVisualization from '../components/query/QueryVisualization';
import StarterPlaceholderMessage from '../components/query/StarterPlaceholderMessage';
import {
  CustomizableChartTypes,
  LeftRight,
  VariableType,
  getYColNamesFromData,
} from '../components/helpers';
import { fetchData } from '../lib/fetch';
import { ChartType } from '@prisma/client';

const DEFAULT_QUERY = `-- PostgreSQL 15
-- Press Ctrl+Enter to run
-- You can use variables by wrapping words in double brackets {{}}
select * from accounts limit 2`;
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

  const parseVariables = (
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
      const regex = new RegExp(`{{${variable}}}`, 'g');
      query = query.replace(regex, value);
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
    const queryWithVariables = parseVariables(query, setError);

    if (queryWithVariables) {
      const data = await fetchData(queryWithVariables, setError);
      setData(data);
      if (data?.length) {
        // default for customizable charts is bar columns, and left axes
        setChartColumnsTypes(
          getYColNamesFromData(data).map((col) => ChartType.BAR)
        );
        setChartAxesTypes(getYColNamesFromData(data).map((col) => 'LEFT'));
      }
    }

    setIsLoading(false);
  };

  return (
    <div className='query-wrapper'>
      <div className='editor-wrapper relative mx-auto mb-4 mt-10 flex min-h-[350px] w-[95%] items-center justify-center'>
        <SqlEditor
          query={query}
          setQuery={setQuery}
          setError={setError}
          isLoading={isLoading}
          runQuery={runQuery}
        />
      </div>
      <div>
        {error && <QueryErrorContainer error={error} setError={setError} />}
        <div className='relative my-12 w-full rounded-t-3xl bg-[#101011] px-5 py-4 md:px-0'>
          {!data?.length ? (
            <StarterPlaceholderMessage />
          ) : (
            <QueryVisualization
              data={data}
              query={query}
              chartColumnsTypes={chartColumnsTypes}
              setChartColumnsTypes={setChartColumnsTypes}
              chartAxesTypes={chartAxesTypes}
              setChartAxesTypes={setChartAxesTypes}
              errorHandler={setError}
              variableDefaults={variableDefaults}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryWrapper;

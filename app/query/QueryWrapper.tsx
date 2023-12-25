'use client';

import React, { useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryErrorContainer from '../components/QueryErrorContainer';
import QueryVisualization from '../components/query/QueryVisualization';
import StarterPlaceholderMessage from '../components/query/StarterPlaceholderMessage';
import {
  CustomizableChartOptions,
  LeftRight,
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
  const [customizableColumnsTypes, setCustomizableColumnsTypes] = useState<
    CustomizableChartOptions[]
  >([]);
  const [customizableAxesTypes, setCustomizableAxesTypes] = useState<
    LeftRight[]
  >([]);
  const [data, setData] = useState<any[] | undefined | never[]>([]);

  const parseVariables = (
    query: string,
    errorHandler: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const inputElements = document.getElementsByClassName('variable-input');

    const res = Array.from(inputElements).every((element) => {
      const variable = element.className.split(' ')[1];
      const value = (element as HTMLButtonElement).value;
      if (!value) {
        errorHandler(`Variable "${variable}" not set.`);
        return false;
      }
      const regex = new RegExp(`{{${variable}}}`, 'g');
      query = query.replace(regex, value);
      return true;
    });

    return res ? query : '';
  };

  const runQuery = async (query: string) => {
    setIsLoading(true);
    setData([]);
    setError('');
    const queryWithVariables = parseVariables(query, setError);

    if (queryWithVariables) {
      const data = await fetchData(queryWithVariables, setError);
      setData(data);
      if (data?.length) {
        // default for customizable charts is bar columns, and left axes
        setCustomizableColumnsTypes(
          getYColNamesFromData(data).map((col) => ChartType.BAR)
        );
        setCustomizableAxesTypes(
          getYColNamesFromData(data).map((col) => LeftRight.left)
        );
      }
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div className='relative mx-auto my-10 min-h-[350px] w-[95%]'>
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
        {!data?.length ? (
          <StarterPlaceholderMessage />
        ) : (
          <QueryVisualization
            data={data}
            query={query}
            customizableColumnsTypes={customizableColumnsTypes}
            setCustomizableColumnsTypes={setCustomizableColumnsTypes}
            customizableAxesTypes={customizableAxesTypes}
            setCustomizableAxesTypes={setCustomizableAxesTypes}
            errorHandler={setError}
          />
        )}
      </div>
    </div>
  );
};

export default QueryWrapper;

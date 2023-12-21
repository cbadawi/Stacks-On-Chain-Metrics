'use client';

import React, { useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryErrorContainer from '../components/QueryErrorContainer';
import QueryVisualization from '../components/query/QueryVisualization';
import {
  CustomizableChartOptions,
  LeftRight,
  getYColNamesFromData,
} from '../components/charts/helpers';
import { fetchData } from '../lib/fetch';
import { ChartType } from '@prisma/client';

const DEFAULT_QUERY = `-- PostgreSQL 15
-- Press Ctrl+Enter to run
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
  const [data, setData] = useState([]);

  const runQuery = async (query: string) => {
    setIsLoading(true);
    setData([]);
    setError('');
    const res = await fetchData(query, setError);
    setIsLoading(false);
    setData(res.data);
    // default for customizable charts is bar columns, and left axes
    if (res.data?.length) {
      setCustomizableColumnsTypes(
        getYColNamesFromData(res.data).map((col) => ChartType.BAR)
      );
      setCustomizableAxesTypes(
        getYColNamesFromData(res.data).map((col) => LeftRight.left)
      );
    }
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
      {query}
      <div>
        {error && <QueryErrorContainer error={error} setError={setError} />}
        <QueryVisualization
          data={data}
          query={query}
          customizableColumnsTypes={customizableColumnsTypes}
          setCustomizableColumnsTypes={setCustomizableColumnsTypes}
          customizableAxesTypes={customizableAxesTypes}
          setCustomizableAxesTypes={setCustomizableAxesTypes}
        />
      </div>
    </div>
  );
};

export default QueryWrapper;

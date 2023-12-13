'use client';

import React, { useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryErrorContainer from '../components/QueryErrorContainer';
import QueryVisualization from '../components/query/QueryVisualization';
import {
  ChartType,
  CustomizableChartOptions,
  LeftRight,
  getYColNamesFromData,
} from '../components/charts/helpers';
import { stacksData2Array } from '../helpers/delet';
import { fetchData } from '../lib/serverData';

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
    console.log('running queyr', query);
    setIsLoading(true);
    setData([]);
    setError('');
    const response = await fetchData(query);
    const json = stacksData2Array(await response.json());
    setIsLoading(false);
    if (response.status == 500) return setError(json.message);
    setData(json);
    // default for customizable charts is bar columns, and left axes
    if (json?.length) {
      setCustomizableColumnsTypes(
        getYColNamesFromData(json).map((col) => ChartType.bar)
      );
      setCustomizableAxesTypes(
        getYColNamesFromData(json).map((col) => LeftRight.left)
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

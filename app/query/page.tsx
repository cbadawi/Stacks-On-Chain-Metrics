'use client';
// TODO keep page.tsx as a server component and move the form(query + viz) to its own client component
// TODO add page title SSR'ed for SEO
// TODO similarly SSR for the StarterPlaceholderMessage container

import React, { useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryVisualization from '../components/query/QueryVisualization';
import { stacksData2Array } from '../helpers/delet';
import QueryErrorContainer from '../components/QueryErrorContainer';
import {
  ChartType,
  CustomizableChartOptions,
  LeftRight,
  getYAxesNamesFromData,
} from '../components/charts/helpers';

const DEFAULT_QUERY = `-- PostgreSQL
select * from accounts limit 2`;
// TODO change default query to something more recent

const Query = () => {
  // Can't use useSearchParams since some queries are too long to fit in the URL's query string.
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

  const runQuery = async () => {
    setIsLoading(true);
    setData([]);
    setError('');
    const response = await fetch('https://api.stacksdata.info/v1/sql', {
      method: 'POST',
      next: { revalidate: 90 },
      headers: {
        'Content-Type': 'application/json',
      },
      body: query,
    });
    const json = stacksData2Array(await response.json());
    setIsLoading(false);
    if (response.status == 500) return setError(json.message);
    setData(json);
    // default for customizable charts is bar columns, and left axes
    if (json?.length) {
      setCustomizableColumnsTypes(
        getYAxesNamesFromData(json).map((col) => ChartType.bar)
      );
      setCustomizableAxesTypes(
        getYAxesNamesFromData(json).map((col) => LeftRight.left)
      );
    }
  };

  // TODO Error message container
  return (
    <div>
      <h1 className='text-xl font-light text-white'>
        stacks blockchain data analytics
      </h1>
      <div className='relative mx-auto my-10 min-h-[350px] w-[95%]'>
        <SqlEditor
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
          runQuery={runQuery}
        />
      </div>
      <div>
        {error && <QueryErrorContainer error={error} setError={setError} />}
        <QueryVisualization
          data={data}
          customizableColumnsTypes={customizableColumnsTypes}
          setCustomizableColumnsTypes={setCustomizableColumnsTypes}
          customizableAxesTypes={customizableAxesTypes}
          setCustomizableAxesTypes={setCustomizableAxesTypes}
        />
      </div>
    </div>
  );
};

export default Query;

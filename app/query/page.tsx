'use client';

import React, { useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryVisualization from '../components/query/QueryVisualization';
import { stacksData2Array } from '../helpers/delet';
import QueryErrorContainer from '../components/QueryErrorContainer';

const DEFAULT_QUERY = `-- PostgreSQL
select * from accounts limit 2`;
// TODO change default query to something more recent

const Query = () => {
  // Can't use useSearchParams since some queries are too long to fit in the URL's query string.
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // TODO useState([]) once you get rid of stacksdata's shit
  const [data, setData] = useState({});

  const runQuery = async () => {
    setIsLoading(true);
    setData({});
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
    response.status == 500 ? setError(json.message) : setData(json);
    setIsLoading(false);
  };

  // TODO Error message container
  return (
    <div>
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
        <QueryVisualization data={data} />
      </div>
    </div>
  );
};

export default Query;

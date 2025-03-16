import React, { Suspense } from 'react';
import QueryWrapper from './QueryWrapper';
import { QueryProvider } from '../contexts/QueryContext';
import Spinner from '../components/Spinner';

const Query = async () => {
  return (
    <div>
      <h1 className='mx-10 mt-5 text-xl font-semibold'>
        Stacks On Chain AI Metrics
      </h1>
      <p className='text-md mx-10 mt-1 text-gray-600'>
        The leading Stacks blockchain data analytics platform will be back soon
        🚧.
      </p>
      <Suspense fallback={<Spinner />}>
        <QueryProvider>
          <QueryWrapper />
        </QueryProvider>
      </Suspense>
    </div>
  );
};
export default Query;

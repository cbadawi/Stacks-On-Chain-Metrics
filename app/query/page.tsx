import React from 'react';
import QueryWrapper from './QueryWrapper';
import { QueryProvider } from '../contexts/QueryContext';

const Query = async () => {
  return (
    <div>
      <h1 className='mx-10 mt-5 text-xl font-semibold'>
        Stacks On Chain AI Metrics
      </h1>
      <QueryProvider>
        <QueryWrapper />
      </QueryProvider>
    </div>
  );
};

export default Query;

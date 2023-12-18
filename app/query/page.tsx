import React from 'react';
import QueryWrapper from './QueryWrapper';

const Query = async () => {
  // TODO Error message container
  return (
    <div>
      <h1 className='text-xl font-light text-white'>
        stacks blockchain data analytics
      </h1>

      <QueryWrapper />
    </div>
  );
};

export default Query;

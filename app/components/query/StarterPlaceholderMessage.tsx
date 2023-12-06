import React from 'react';

const StarterPlaceholderMessage = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <p className='pb-2'>Write your SQL query, or start from a template.</p>
      <p className='pb-2'>No prior experience needed.</p>
      <div className='flex'>
        <button className='btn btn-outline btn-primary'>Read the docs</button>
        <button className='btn btn-primary ml-2'>Start from a template</button>
      </div>
    </div>
  );
};

export default StarterPlaceholderMessage;

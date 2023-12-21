import React from 'react';

const Stats = ({ data }: { data: any[] }) => {
  const firstRow = data[0];
  const keys = Object.keys(firstRow);
  return (
    <div className='flex items-center justify-center gap-4'>
      {keys.map((k) => {
        return (
          <div className='m-8 flex-col items-center justify-center'>
            <h2 className='card-title text-3xl font-semibold text-orange-400'>
              {k}
            </h2>
            <p className='flex justify-center text-xl text-gray-400'>
              {' '}
              {firstRow[k]}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;

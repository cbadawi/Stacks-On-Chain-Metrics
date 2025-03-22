import { prettyValue } from '@/app/lib/pretty';
import React from 'react';

const Stats = ({ data }: { data: any[] }) => {
  if (!data?.length) return null;
  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  return (
    <div className='flex items-center justify-center gap-4'>
      {keys.map((k, index) => {
        return (
          <div
            key={'div-' + index}
            className='mx-8 my-4 flex flex-col items-center justify-center'
          >
            <h2
              key={'h2-' + index}
              className='card-title flex h-12 items-center text-3xl font-semibold text-orange-400'
            >
              {k === '?column?' ? '' : k}
            </h2>
            <p
              key={'p-' + index}
              className='flex justify-center text-xl text-gray-400'
            >
              {prettyValue(firstRow[k])}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;

import React from 'react';
import { parseValue } from './parseValue';

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
            className='mx-8 my-4 flex-col items-center justify-center'
          >
            <h2
              key={'h2-' + index}
              className='card-title text-3xl font-semibold text-orange-400'
            >
              {k}
            </h2>
            <p
              key={'p-' + index}
              className='flex justify-center text-xl text-gray-400'
            >
              {parseValue(firstRow[k])}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;

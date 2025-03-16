'use client';

import React from 'react';
import QueryErrorContainer from '../QueryErrorContainer';
import LoadingSkeleton from '@/app/dashboards/loading';
import ChartContainer from '../charts/ChartContainer';
import { ChartType } from '@prisma/client';

type ChartContentProps = {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  chartData: any[];
  chartType: ChartType;
  chartId: number;
  width: number;
  height: number;
};

const ChartContent = ({
  error,
  setError,
  isLoading,
  chartData,
  chartType,
  chartId,
  width,
  height,
}: ChartContentProps) => {
  return (
    <>
      <div className='absolute z-20 w-full'>
        {error && <QueryErrorContainer error={error} setError={setError} />}
      </div>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        chartData?.length > 0 && (
          <ChartContainer
            key={chartId}
            data={chartData}
            chartType={chartType}
            height={height}
            width={width}
          />
        )
      )}
    </>
  );
};

export default ChartContent;

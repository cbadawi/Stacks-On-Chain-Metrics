'use client';

import React from 'react';
import BrushChart from './Brush';
import { ChartType } from '../query/QueryVisualization';
import Table from './Table';

interface ChartContainerProps {
  chartType: ChartType;
  data: any;
}

const renderChart = (
  chartType: ChartType,
  data: any,
  title: string,
  height: number | string,
  width: number | string
) => {
  console.log('charttype checking', chartType);

  switch (Number(chartType)) {
    // case ChartType.table:
    //   return <Table data={data} />;
    case ChartType.line:
      console.log('charttype is lineeeeee');
      return (
        <BrushChart
          data={data}
          chartType={chartType}
          height={Number(height)}
          width={Number(width)}
        />
      );
  }
};

const ChartContainer = ({ chartType, data }: ChartContainerProps) => {
  // TODO using widow causes Unhandled Runtime Error
  // Error: Hydration failed because the initial UI does not match what was rendered on the server.
  // Warning: Expected server HTML to contain a matching <div> in <div>.
  // See more info here: https://nextjs.org/docs/messages/react-hydration-error
  // if (typeof window == 'undefined') return null;
  // const height = window.innerHeight * 0.75;
  // const width = window.innerWidth * 0.75;
  return (
    <div className='chart-container flex  justify-center '>
      <div className='max-h-screen max-w-[96%] overflow-auto'>
        {data?.length && renderChart(chartType, data, '', '700', '900')}
      </div>
    </div>
  );
};

export default ChartContainer;

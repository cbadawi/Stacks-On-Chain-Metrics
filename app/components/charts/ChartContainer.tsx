'use client';

import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import Table from './Table';
import { ChartType } from '@prisma/client';
import Stats from './Stats';
import { Card, CardContent } from '@/components/ui/card';

import LineChart from './LineChartComponent';
import BarChart from './BarChartComponent';
import PieChart from './PieChartComponenet';

interface ChartContainerProps {
  chartType: ChartType;
  data: any[];
  height?: number;
  width?: number;
  errorHandler?: (msg: string) => void;
}

const getChartComponent = (
  chartType: ChartType,
  data: any[],
  height?: number,
  width?: number,
  errorHandler?: (msg: string) => void
): ReactNode & ReactElement<any, string | JSXElementConstructor<any>> => {
  try {
    switch (chartType) {
      case ChartType.LINE:
        return <LineChart data={data} height={height} width={width} />;
      case ChartType.BAR:
        return <BarChart data={data} height={height} width={width} />;
      case ChartType.PIE:
        return (
          <PieChart
            data={data}
            errorHandler={errorHandler}
            height={Math.min(height ?? Infinity, width ?? Infinity)}
          />
        );
      case ChartType.NUMBER:
        return <Stats data={data} />;
      default:
        return (
          <div
            style={{
              width: '100%',
              height: height ?? '100%',
              overflow: 'scroll',
            }}
          >
            <Table data={data} />
          </div>
        );
    }
  } catch (e) {
    console.error('error loading chart', e);
    return (
      <div style={{ height, overflow: 'scroll' }}>
        <Table data={data} />;
      </div>
    );
  }
};

const ChartContainer = ({
  chartType,
  data,
  height,
  width,
  errorHandler,
}: ChartContainerProps) => {
  return (
    <div className='chart-container h-full w-full bg-transparent '>
      <Card className='card h-full w-full border-none bg-transparent shadow-none'>
        <CardContent className='card-content flex w-full items-center justify-center'>
          {getChartComponent(chartType, data, height, width, errorHandler)}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartContainer;

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
  errorHandler?: (msg: string) => void;
}

const getChartComponent = (
  chartType: ChartType,
  data: any[],
  errorHandler?: (msg: string) => void
): ReactNode & ReactElement<any, string | JSXElementConstructor<any>> => {
  try {
    switch (chartType) {
      case ChartType.LINE:
        return <LineChart data={data} />;
      case ChartType.BAR:
        return <BarChart data={data} />;
      case ChartType.PIE:
        return <PieChart data={data} errorHandler={errorHandler} />;
      case ChartType.NUMBER:
        return <Stats data={data} />;
      default:
        return <Table data={data} />;
    }
  } catch (e) {
    console.error('error loading chart', e);
    return <Table data={data} />;
  }
};

const CardContainer = ({
  chartType,
  data,
  errorHandler,
}: ChartContainerProps) => {
  return (
    <div className='w-full bg-transparent '>
      <Card className='w-full border-none bg-transparent shadow-none'>
        <CardContent>
          {getChartComponent(chartType, data, errorHandler)}
        </CardContent>
      </Card>
    </div>
  );
};

export default CardContainer;

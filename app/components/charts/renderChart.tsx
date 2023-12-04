'use client';
import React from 'react';
import BrushChart from './BrushOld';
import Table from './Table';
import Pie from './Pie';

export const renderChart = (
  chartType: ChartType,
  data: any,
  title: string,
  height: number | string,
  width: number | string,
  showTooltipLine: boolean,
  showBrush: boolean
) => {
  const columns = Object.keys(data[0]);
  const xName = columns[0];
  const yNames = columns.slice(1);

  switch (Number(chartType)) {
    case ChartType.table:
      return <Table data={data} />;
    case ChartType.line:
    case ChartType.bar:
      return (
        <BrushChart
          data={data}
          xName={xName}
          yNames={yNames}
          chartType={chartType}
          height={Number(height)}
          width={Number(width)}
        />
      );
    case ChartType.pie:
      return (
        <Pie
          data={data}
          xName={xName}
          yName={yNames[0]}
          width={Number(width)}
        />
      );
  }
};

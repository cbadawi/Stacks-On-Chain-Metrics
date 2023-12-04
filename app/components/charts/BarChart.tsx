import React from 'react';
import { ChartType, getScaleCallback, getXScale, getYScale } from './helpers';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import BaseChart from './BaseChart';
import { localPoint } from '@visx/event';

interface BarChartProps {
  filteredData: any[];
  xName: string;
  yName: string;
  chartType: ChartType;
  xMax: number;
  yMax: number;
  height: number;
  width: number;
  margin: { top: number; right: number; bottom: number; left: number };
  topChartBottomMargin: number;
  showTooltip?: any;
  hideTooltip?: any;
}
const BarChart = ({
  filteredData,
  xName,
  yName,
  chartType,
  xMax,
  yMax,
  height,
  width,
  margin,
  topChartBottomMargin,
  showTooltip,
  hideTooltip,
}: BarChartProps) => {
  const background2 = '#af8baf';

  const xScaleCallback = getScaleCallback(filteredData, xName, 'x', chartType)!;
  const yScaleCallback = getScaleCallback(filteredData, yName, 'y') as
    | typeof scaleLinear
    | typeof scaleTime;
  const xScale = getXScale(
    filteredData,
    xName,
    xMax,
    xScaleCallback,
    'x',
    chartType
  )!;
  const yScale = getYScale(filteredData, yName, yMax, yScaleCallback)!;
  return (
    <BaseChart
      xName={xName}
      yNames={[yName]}
      chartType={chartType}
      data={filteredData}
      height={Number(height)}
      width={Number(width)}
      margin={{ ...margin, bottom: topChartBottomMargin }}
      yMax={yMax}
      xScale={xScale!}
      yScale={yScale!}
      localPoint={localPoint}
      showTooltip={showTooltip}
      gradientColor={background2}
      hideTooltip={hideTooltip}
      showGrid={true}
    />
  );
};

export default BarChart;

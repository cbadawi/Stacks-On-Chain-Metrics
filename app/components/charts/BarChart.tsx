import React from 'react';
import {
  ChartConfigs,
  ChartType,
  CustomizableChartOptions,
  LeftRight,
  getScaleCallback,
  getXScale,
  getYScale,
} from './helpers';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import BaseChart from './BaseChart';
import { localPoint } from '@visx/event';
import { ScaleLinear, ScaleTime } from '@visx/vendor/d3-scale';

interface BarChartProps {
  filteredData: any[];
  xName: string;
  yNames: string[];
  chartConfigs: ChartConfigs;
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
  yNames,
  chartConfigs,
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
  // Getting the scale for just the first Y col, for simplicity

  const xScale = getXScale(
    filteredData,
    xName,
    xMax,
    xScaleCallback,
    'x',
    chartType
  )!;

  const yScaleCallback = getScaleCallback(filteredData, yNames[0], 'y') as
    | typeof scaleLinear
    | typeof scaleTime;
  const yScaleLeftCallback = getScaleCallback(
    filteredData,
    chartConfigs.leftAxisColumnNames[0], // TODO checking only the first column's type is fragile and might break with un-knowing users
    'y'
  ) as typeof scaleLinear | typeof scaleTime;

  const yScaleRightCallback = getScaleCallback(
    filteredData,
    chartConfigs.rightAxisColumnNames[0],
    'y'
  ) as typeof scaleLinear | typeof scaleTime;

  const yScale = getYScale(
    filteredData,
    yNames,
    yMax,
    yScaleCallback,
    chartType
  )!;

  let yScaleLeft:
    | ScaleLinear<number, number, never>
    | ScaleTime<number, number, never>
    | undefined;

  let yScaleRight:
    | ScaleLinear<number, number, never>
    | ScaleTime<number, number, never>
    | undefined;
  if (chartConfigs.leftAxisColumnNames?.length)
    yScaleLeft = getYScale(
      filteredData,
      chartConfigs.leftAxisColumnNames,
      yMax,
      yScaleLeftCallback,
      chartType
    )!;

  if (chartConfigs.rightAxisColumnNames?.length)
    yScaleRight = getYScale(
      filteredData,
      chartConfigs.rightAxisColumnNames,
      yMax,
      yScaleRightCallback,
      ChartType.line
    )!;

  return (
    <BaseChart
      xName={xName}
      yNames={yNames}
      chartConfigs={chartConfigs}
      chartType={chartType}
      data={filteredData}
      height={Number(height)}
      width={Number(width)}
      margin={{ ...margin, bottom: topChartBottomMargin }}
      xMax={xMax}
      yMax={yMax}
      xScale={xScale!}
      yScale={yScale!}
      yScaleLeft={yScaleLeft}
      yScaleRight={yScaleRight}
      localPoint={localPoint}
      showTooltip={showTooltip}
      gradientColor={background2}
      hideTooltip={hideTooltip}
      showGrid={true}
    />
  );
};

export default BarChart;

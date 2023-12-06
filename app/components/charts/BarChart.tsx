import React from 'react';
import {
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
  customizableColumnsTypes: CustomizableChartOptions[];
  customizableAxesTypes: LeftRight[];
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
  customizableColumnsTypes,
  customizableAxesTypes,
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

  const leftAxisColumnNames = yNames.filter(
    (_, index) => customizableAxesTypes[index] == LeftRight.left
  );
  const rightAxisColumnNames = yNames.filter(
    (_, index) => customizableAxesTypes[index] == LeftRight.right
  );

  const yScaleLeftCallback = getScaleCallback(
    filteredData,
    leftAxisColumnNames[0], // TODO checking only the first column's type is fragile and might break with un-knowing users
    'y'
  ) as typeof scaleLinear | typeof scaleTime;

  const yScaleRightCallback = getScaleCallback(
    filteredData,
    rightAxisColumnNames[0],
    'y'
  ) as typeof scaleLinear | typeof scaleTime;

  const yScale = getYScale(
    filteredData,
    yNames,
    yMax,
    yScaleLeftCallback,
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
  if (leftAxisColumnNames?.length)
    yScaleLeft = getYScale(
      filteredData,
      leftAxisColumnNames,
      yMax,
      yScaleLeftCallback,
      chartType
    )!;

  if (rightAxisColumnNames?.length)
    yScaleRight = getYScale(
      filteredData,
      rightAxisColumnNames,
      yMax,
      yScaleRightCallback,
      ChartType.line
    )!;

  console.log(
    leftAxisColumnNames,
    yScaleLeftCallback.name,
    rightAxisColumnNames,
    yScaleRightCallback?.name
  );

  return (
    <BaseChart
      xName={xName}
      yNames={yNames}
      customizableColumnsTypes={customizableColumnsTypes}
      customizableAxesTypes={customizableAxesTypes}
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

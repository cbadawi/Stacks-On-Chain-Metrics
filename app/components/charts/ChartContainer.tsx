'use client';

import React, { useState } from 'react';
import { LinearGradient } from '@visx/gradient';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import {
  ChartType,
  CustomizableChartOptions,
  LeftRight,
  accentColorDark,
  createChartConfigs,
} from './helpers';
import Table from './Table';
import Pie from './Pie';
import getBrush from './getBrush';
import TooltipLine from './TooltipLine';
import TooltipData from './TooltipData';
import LineChart from './LineChart';
import BarChart from './BarChart';

interface ChartContainerProps {
  chartType: ChartType;
  data: any[];
  height: number;
  width: number;
  customizableColumnsTypes: CustomizableChartOptions[];
  customizableAxesTypes: LeftRight[];
}

const getChartComponent = (
  chartType: ChartType,
  filteredData: any[],
  xName: string,
  yNames: string[],
  customizableColumnsTypes: CustomizableChartOptions[],
  customizableAxesTypes: LeftRight[],
  title: string,
  height: number | string,
  width: number | string,
  topChartHeight: number,
  topChartBottomMargin: number,
  margin: { top: number; right: number; bottom: number; left: number },
  background2: string,
  // localPoint?: any,
  showTooltip?: any,
  hideTooltip?: () => void
) => {
  const xMax = Math.max(Number(width) - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);

  switch (Number(chartType)) {
    case ChartType.line:
      return (
        <LineChart
          data={filteredData}
          xName={xName}
          yNames={yNames}
          chartType={chartType}
          xMax={xMax}
          yMax={yMax}
          height={Number(height)}
          width={Number(width)}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip!}
        />
      );
    case ChartType.bar:
      // Bar chart is the customizable chart
      const chartConfigs = createChartConfigs(
        yNames,
        customizableColumnsTypes,
        customizableAxesTypes
      );
      return (
        <BarChart
          filteredData={filteredData}
          xName={xName}
          yNames={yNames}
          chartConfigs={chartConfigs}
          chartType={chartType}
          xMax={xMax}
          yMax={yMax}
          height={Number(height)}
          width={Number(width)}
          margin={margin}
          topChartBottomMargin={topChartBottomMargin}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />
      );
    case ChartType.pie:
      return (
        <Pie
          data={filteredData}
          xName={xName}
          yName={yNames[0]}
          width={Number(width)}
        />
      );
  }
};

const ChartContainer = ({
  chartType,
  data,
  height,
  width,
  customizableColumnsTypes,
  customizableAxesTypes,
}: ChartContainerProps) => {
  // TODO fix using widow causes Unhandled Runtime Error
  // Error: Hydration failed because the initial UI does not match what was rendered on the server.
  // Warning: Expected server HTML to contain a matching <div> in <div>.
  // See more info here: https://nextjs.org/docs/messages/react-hydration-error
  // if (typeof window == 'undefined') return null;
  // const height = window.innerHeight * 0.75;
  // const width = window.innerWidth * 0.75;
  const [filteredData, setFilteredData] = useState(data);

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
  });

  type TooltipData = any;
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<TooltipData>({
    // initial tooltip state
    tooltipOpen: true,
    tooltipLeft: 0,
    tooltipTop: 50,
    // tooltipData: '',
  });

  // Styles
  const GRADIENT_ID = 'brush_gradient';
  const background = '#584153';
  const background2 = '#af8baf';

  const margin = {
    top: 50,
    left: 80,
    bottom: 0,
    right: 50,
  };

  const chartSeparation = 30;

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = chartSeparation + 20; // need seperation to make room for the x-axis title
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  const columns = Object.keys(data[0]);
  const xName = columns[0];
  const yNames = columns.slice(1);

  const showTooltipData =
    chartType == ChartType.line || chartType == ChartType.bar;
  const showTooltipLine = chartType == ChartType.line;
  const showBrush = chartType == ChartType.line;
  // data

  const { handleResetClick, brush } = getBrush({
    showBrush,
    data,
    xName,
    yName: yNames[0],
    height,
    width,
    topChartHeight,
    topChartBottomMargin,
    margin,
    setFilteredData,
    bottomChartHeight,
    background2,
  });

  return (
    <div className='chart-container relative flex max-w-full items-center justify-center'>
      {JSON.stringify({ customizableAxesTypes, customizableColumnsTypes })}
      {chartType != ChartType.table && (
        <div className='relative'>
          <svg width={width} height={height}>
            <LinearGradient
              id={GRADIENT_ID}
              from={background}
              to={background2}
              rotate={45}
            />
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${GRADIENT_ID})`}
              rx={14}
            />
            {filteredData?.length &&
              getChartComponent(
                chartType,
                filteredData,
                xName,
                yNames,
                customizableColumnsTypes,
                customizableAxesTypes,
                '',
                height,
                width,
                topChartHeight,
                topChartBottomMargin,
                margin,
                background2,
                showTooltip,
                hideTooltip
              )}
            {showBrush && brush}
            {tooltipData && showTooltipLine && (
              <TooltipLine
                tooltipLeft={tooltipLeft}
                tooltipTop={tooltipTop}
                circleFill={accentColorDark}
                lineStroke={accentColorDark}
                marginTop={margin.top}
                marginLeft={margin.left}
              />
            )}
          </svg>
          {tooltipData && showTooltipData && (
            <TooltipData
              TooltipInPortal={TooltipInPortal}
              tooltipTop={tooltipTop}
              tooltipLeft={tooltipLeft + margin.left}
              tooltipData={tooltipData}
              xName={xName}
              yNames={yNames}
            />
          )}
          {showBrush && <button onClick={handleResetClick}>Reset Scale</button>}
        </div>
      )}
      {/* <Table data={filteredData} /> */}
    </div>
  );
};

export default ChartContainer;

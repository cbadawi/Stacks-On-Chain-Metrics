'use client';

import React, { useState } from 'react';
import { LinearGradient } from '@visx/gradient';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { accentColorDark, createChartConfigs } from '../helpers';
import Table from './Table';
import Pie from './Pie';
import getBrush from './getBrush';
import TooltipLine from './TooltipLine';
import TooltipData from './TooltipData';
import LineChart from './LineChart';
import BarChart from './BarChart';
import { ChartType, CustomizableChartTypes, LeftRight } from '@prisma/client';
import Stats from './Stats';

interface ChartContainerProps {
  chartType: ChartType;
  data: any[];
  height: number;
  width: number;
  chartColumnsTypes?: CustomizableChartTypes[];
  chartAxesTypes?: LeftRight[];
  errorHandler?: (msg: string) => void;
}

const getChartComponent = (
  chartType: ChartType,
  filteredData: any[],
  xName: string,
  yNames: string[],
  height: number | string,
  width: number | string,
  mainChartHeight: number,
  margin: { top: number; right: number; bottom: number; left: number },
  showTooltip?: any,
  hideTooltip?: () => void,
  chartColumnsTypes?: CustomizableChartTypes[],
  chartAxesTypes?: LeftRight[],
  errorHandler?: (msg: string) => void
) => {
  const xMax = Math.max(Number(width) - margin.left - margin.right, 0);
  const yMax = Math.max(mainChartHeight, 0);

  switch (chartType) {
    case ChartType.LINE:
      return (
        <LineChart
          data={filteredData}
          xName={xName}
          yNames={yNames}
          chartType={chartType}
          margin={margin}
          xMax={xMax}
          yMax={yMax}
          height={Number(height)}
          width={Number(width)}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip!}
          errorHandler={errorHandler}
        />
      );
    case ChartType.BAR:
      // Bar chart is the customizable chart
      console.log(chartColumnsTypes, chartAxesTypes);
      const chartConfigs =
        chartColumnsTypes &&
        chartAxesTypes &&
        createChartConfigs(yNames, chartColumnsTypes, chartAxesTypes);
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
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
        />
      );
    case ChartType.PIE:
      return (
        <Pie
          data={filteredData}
          xName={xName}
          yName={yNames[0]}
          height={Number(height)}
          width={Number(width)}
          errorHandler={errorHandler}
        />
      );
  }
};

const ChartContainer = ({
  chartType,
  data,
  height,
  width,
  chartColumnsTypes,
  chartAxesTypes,
  errorHandler,
}: ChartContainerProps) => {
  // TODO fix using widow causes Unhandled Runtime Error
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
  const background2 = '#af8baf';

  const margin = {
    top: 20,
    left: 60,
    bottom: 0,
    right: 30,
  };

  const showTooltipData =
    chartType == ChartType.LINE || chartType == ChartType.BAR;
  const showTooltipLine = chartType == ChartType.LINE;
  const showBrush = chartType == ChartType.LINE;

  // seperation from brush
  const chartSeparation = 30;
  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = showBrush ? chartSeparation + 20 : 0; // need seperation to make room for the x-axis title
  const mainChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight =
    innerHeight - mainChartHeight - topChartBottomMargin;

  const columns = Object.keys(data[0]);
  const xName = columns[0];
  const yNames = columns.slice(1);

  const resetScaleHeightPx = 24;
  if (showBrush) height = height - resetScaleHeightPx;
  // data

  const { handleResetClick, brush } = getBrush({
    showBrush,
    data,
    xName,
    yName: yNames[0],
    height,
    width,
    mainChartHeight,
    topChartBottomMargin,
    mainChartMargin: margin,
    setFilteredData,
    bottomChartHeight,
    background2,
  });

  return (
    <div className='chart-container relative flex max-w-full items-center justify-center'>
      {chartType != ChartType.TABLE && chartType != ChartType.NUMBER && (
        <div className='relative'>
          <div className='bg-blac'>
            <svg
              width={width}
              height={height}
              className='flex items-center justify-center bg-black'
            >
              {filteredData?.length &&
                getChartComponent(
                  chartType,
                  filteredData,
                  xName,
                  yNames,
                  height,
                  width,
                  mainChartHeight,
                  margin,
                  showTooltip,
                  hideTooltip,
                  chartColumnsTypes,
                  chartAxesTypes,
                  errorHandler
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
          </div>
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
          {showBrush && (
            <button
              className={`h-[${resetScaleHeightPx}px]`}
              onClick={handleResetClick}
            >
              Reset Scale
            </button>
          )}
        </div>
      )}
      {chartType == ChartType.TABLE && <Table data={filteredData} />}
      {chartType == ChartType.NUMBER && <Stats data={filteredData} />}
    </div>
  );
};

export default ChartContainer;

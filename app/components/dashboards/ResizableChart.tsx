'use client';

import React, { useState } from 'react';
import { convertRemToPixels } from '@/app/lib/convertRemToPixels';
import ResizableDraggableCard from './ResizableDraggableCard';
import ChartContainer from '../charts/ChartContainer';
import { Chart, ChartType } from '@prisma/client';
import { ChartWithData } from '@/app/lib/db/dashboards/dashboard';
import { updateChart } from '@/app/lib/db/dashboards/charts';
import { Position, isCollidingWithOtherCharts } from '../helpers';

type ResizableChartProps = {
  chart: ChartWithData;
  allCharts: ChartWithData[];
};

const ResizableChart = ({ chart, allCharts }: ResizableChartProps) => {
  const [cardProperties, setCardProperties] = useState<Position>({
    height: 400,
    width: 550,
    x: 0,
    y: 0,
  });

  const titleHeaderPaddingRem = 0.5;
  const titleHeaderHeightRem = 2;
  const childrenHorizontalPaddingRem = 1.5;
  const chartContainerHeight =
    cardProperties.height -
    convertRemToPixels(titleHeaderHeightRem + 2 * titleHeaderPaddingRem);
  const chartContainerWidth =
    cardProperties.width - convertRemToPixels(childrenHorizontalPaddingRem);

  const chartUpdateHandler = ({ height, width, x, y }: Position) => {
    if (
      isCollidingWithOtherCharts(
        { id: chart.id, height, width, x, y },
        allCharts
      )
    )
      return;
    setCardProperties({ height, width, x, y });
    const newChart = chart;
    newChart.height = height;
    newChart.width = width;
    newChart.x = x;
    newChart.y = y;
    updateChart(newChart);
  };

  return (
    <ResizableDraggableCard
      title={chart.title}
      cardProperties={cardProperties}
      titleHeaderHeightRem={titleHeaderHeightRem}
      titleHeaderPaddingRem={titleHeaderPaddingRem}
      childrenHorizontalPaddingRem={childrenHorizontalPaddingRem}
      chartUpdateHandler={chartUpdateHandler}
      defaultPosition={chart}
    >
      {!!chart.data?.length && (
        <ChartContainer
          data={chart.data}
          chartType={chart.type}
          height={chartContainerHeight}
          width={chartContainerWidth}
        />
      )}
    </ResizableDraggableCard>
  );
};

export default ResizableChart;

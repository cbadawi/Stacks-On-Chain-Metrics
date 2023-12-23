'use client';

import React, { useState } from 'react';
import { convertRemToPixels } from '@/app/lib/convertRemToPixels';
import ResizableDraggableCard from './ResizableDraggableCard';
import ChartContainer from '../charts/ChartContainer';
import { Chart, ChartType } from '@prisma/client';
import { ChartWithData } from '@/app/lib/db/dashboards/dashboard';
import { updateChart } from '@/app/lib/db/dashboards/charts';
import { Position } from '../helpers';

export type CardProperties = {
  height: number;
  width: number;
  x: number;
  y: number;
};

type ResizableChartProps = {
  chart: ChartWithData;
};

const ResizableChart = ({ chart }: ResizableChartProps) => {
  const [cardProperties, setCardProperties] = useState<CardProperties>({
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

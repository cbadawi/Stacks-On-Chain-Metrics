'use client';

import React, { useEffect, useState } from 'react';
import { convertRemToPixels } from '@/app/lib/convertRemToPixels';
import ResizableDraggableCard from './ResizableDraggableCard';
import ChartContainer from '../charts/ChartContainer';
import { Chart, ChartType } from '@prisma/client';
import { ChartWithData } from '@/app/lib/db/dashboards/dashboard';
import { updateChart } from '@/app/lib/db/dashboards/charts';
import { Position, VariableType, isCollidingWithOtherCharts } from '../helpers';
import { fetchData } from '@/app/lib/fetch';
import { replaceVariables } from '@/app/lib/db/replaceVariables';
import QueryErrorContainer from '../QueryErrorContainer';
import Spinner from '../Spinner';
import LoadingSkeleton from '@/app/dashboards/loading';

type ResizableChartProps = {
  chart: ChartWithData;
  allCharts: ChartWithData[];
  variables: VariableType[];
};

const ResizableChart = ({
  chart,
  allCharts,
  variables,
}: ResizableChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cardProperties, setCardProperties] = useState<Position>({
    height: 400,
    width: 550,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (variables?.length) {
      fetchChartData(chart, variables);
    } else setChartData(chart.data);
  }, [variables]);

  const fetchChartData = async (
    chart: ChartWithData,
    variables: VariableType[]
  ) => {
    setError('');
    setIsLoading(true);
    const queryWithVariables = replaceVariables(chart.query, variables);
    const data = await fetchData(queryWithVariables, setError);
    setChartData(data);
    setIsLoading(false);
  };

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
      {error && <QueryErrorContainer error={error} setError={setError} />}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        !!chartData?.length && (
          <ChartContainer
            key={JSON.stringify(chartData)}
            data={chartData}
            chartType={chart.type}
            height={chartContainerHeight}
            width={chartContainerWidth}
          />
        )
      )}
    </ResizableDraggableCard>
  );
};

export default ResizableChart;

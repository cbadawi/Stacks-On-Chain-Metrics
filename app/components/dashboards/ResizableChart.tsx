'use client';

import React, { useEffect, useState } from 'react';
import { convertRemToPixels } from '@/app/lib/convertRemToPixels';
import ResizableDraggableCard from './ResizableDraggableCard';
import ChartContainer from '../charts/ChartContainer';
import { ChartWithData } from '@/app/lib/db/dashboards/dashboard';
import { persistChartUpdate } from '@/app/lib/db/dashboards/charts';
import {
  Position,
  PositionWithID,
  VariableType,
  isAvailablePosition,
  transformPositionBetweenPxAndPerc,
} from '../helpers';
import { replaceVariables } from '@/app/lib/db/replaceVariables';
import QueryErrorContainer from '../QueryErrorContainer';
import LoadingSkeleton from '@/app/dashboards/loading';
import Modal from '../Modal';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Chart, ChartType } from '@prisma/client';
import { fetchData } from '@/app/query/actions';

SyntaxHighlighter.registerLanguage('sql', sql);

type ResizableChartProps = {
  dashboardId: number;
  chart: ChartWithData;
  chartsPositions: PositionWithID[];
  updateChartPosition: (id: number, newPos: PositionWithID) => void;
  updateContainerHeight: (positions: PositionWithID[]) => void;
  variables: VariableType[];
  baseModalId: string;
  editMode: boolean;
};

const validateDimensions = (
  chartType: ChartType,
  height: number,
  width: number,
  keysLength: number
) => {
  switch (chartType) {
    case 'BAR':
      return {
        height: Math.max(height, 400),
        width: Math.max(width, 600),
      };
    case 'LINE':
      return {
        height: Math.max(height, 300),
        width: Math.max(width, 500),
      };
    case 'PIE':
      return {
        height: Math.max(height, 350),
        width: Math.max(width, 350),
      };
    case 'NUMBER':
      return {
        height: Math.max(height, 200),
        width: Math.max(width, 200 + 100 * keysLength),
      };
    case 'TABLE':
      return {
        height: Math.max(height, 350),
        width: Math.max(width, 350),
      };
    default:
      return {
        height: Math.max(height, 300),
        width: Math.max(width, 400),
      };
  }
};

const ResizableChart = ({
  chart,
  dashboardId,
  chartsPositions,
  updateChartPosition,
  updateContainerHeight,
  variables,
  editMode,
  baseModalId,
}: ResizableChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pos = chartsPositions.find((p) => p.id == chart.id);
  if (!pos) return;
  const { x, y, height, width } = pos;
  const keys = Object.keys(chart.data[0] || {});
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
    const response = await fetchData(queryWithVariables);
    setChartData(response);
    setIsLoading(false);
  };

  const titleHeaderPaddingRem = 1;
  const titleHeaderHeightRem = 3.5;
  const childrenHorizontalPaddingRem = 1.5;
  const chartContainerHeight =
    height -
    convertRemToPixels(titleHeaderHeightRem + 2 * titleHeaderPaddingRem);
  const chartContainerWidth =
    width - convertRemToPixels(childrenHorizontalPaddingRem);

  const onStopHandler = (newPos: Position, allCharts: PositionWithID[]) => {
    const { x, y, height: unvalidatedHeight, width: unvalidatedWidth } = newPos;

    const { height, width } = validateDimensions(
      chart.type,
      unvalidatedHeight,
      unvalidatedWidth,
      keys.length
    );
    const isAvailable = isAvailablePosition(
      {
        id: chart.id,
        width,
        height,
        x,
        y,
      },
      allCharts
    );

    if (!isAvailable) return;
    const oldChart = chartsPositions.find((c) => c.id == chart.id);
    if (!oldChart) return;
    const newChartPosition = { ...oldChart, width, height, x, y };
    updateChartPosition(chart.id, newChartPosition);
    updateContainerHeight([...allCharts, newChartPosition]);
    const xInPerc = transformPositionBetweenPxAndPerc(x, 'x', 'perc');
    const yInPerc = transformPositionBetweenPxAndPerc(y, 'y', 'perc');
    const wInPerc = transformPositionBetweenPxAndPerc(width, 'x', 'perc');
    const hInPerc = transformPositionBetweenPxAndPerc(height, 'y', 'perc');
    console.log('persisting position change : ', { x, xInPerc, y, yInPerc });
    const newChartInPercent = {
      ...chart,
      height: hInPerc,
      width: wInPerc,
      x: xInPerc,
      y: yInPerc,
    };
    persistChartUpdate(newChartInPercent);
  };

  const onMovementHandler = (
    resizedPos: PositionWithID,
    allCharts: PositionWithID[]
  ) => {
    updateContainerHeight([...allCharts, resizedPos]);
  };

  return (
    <ResizableDraggableCard
      chartId={chart.id}
      dashboardId={dashboardId}
      title={chart.title}
      query={chart.query}
      allCharts={chartsPositions}
      baseModalId={baseModalId}
      titleHeaderHeightRem={titleHeaderHeightRem}
      titleHeaderPaddingRem={titleHeaderPaddingRem}
      childrenHorizontalPaddingRem={childrenHorizontalPaddingRem}
      onStopHandler={onStopHandler}
      onMovementHandler={onMovementHandler}
    >
      {error && <QueryErrorContainer error={error} setError={setError} />}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        !!chartData?.length && (
          <ChartContainer
            key={chart.id}
            data={chartData}
            chartType={chart.type}
            height={chartContainerHeight}
            width={chartContainerWidth}
            // chartAxesTypes={chart.axesTypes}
            // chartColumnsTypes={chart.columnTypes}
          />
        )
      )}
    </ResizableDraggableCard>
  );
};

export default ResizableChart;

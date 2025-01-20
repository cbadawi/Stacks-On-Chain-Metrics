'use client';

import React, { useEffect, useState } from 'react';
import { convertRemToPixels } from '@/app/lib/convertRemToPixels';
import ResizableDraggableCard from './ResizableDraggableCard';
import ChartContainer from '../charts/CardContainer';
import { ChartWithData } from '@/app/lib/db/dashboards/dashboard';
import { persistChartUpdate } from '@/app/lib/db/dashboards/charts';
import {
  Position,
  PositionWithID,
  VariableType,
  isAvailablePosition,
  transformPositionBetweenPxAndPerc,
} from '../helpers';
import { fetchData, getCookie } from '@/app/lib/fetch';
import { replaceVariables } from '@/app/lib/db/replaceVariables';
import QueryErrorContainer from '../QueryErrorContainer';
import LoadingSkeleton from '@/app/dashboards/loading';
import Modal from '../Modal';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Chart } from '@prisma/client';

SyntaxHighlighter.registerLanguage('sql', sql);

type ResizableChartProps = {
  chart: ChartWithData;
  chartsPositions: PositionWithID[];
  updateChartPosition: (id: number, newPos: PositionWithID) => void;
  updateContainerHeight: (positions: PositionWithID[]) => void;
  variables: VariableType[];
  baseModalId: string;
};

const ResizableChart = ({
  chart,
  chartsPositions,
  updateChartPosition,
  updateContainerHeight,
  variables,
  baseModalId,
}: ResizableChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pos = chartsPositions.find((p) => p.id == chart.id);
  if (!pos) return;
  const { x, y, height, width } = pos;

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
    height -
    convertRemToPixels(titleHeaderHeightRem + 2 * titleHeaderPaddingRem);
  const chartContainerWidth =
    width - convertRemToPixels(childrenHorizontalPaddingRem);

  const onStopHandler = (newPos: Position, allCharts: PositionWithID[]) => {
    const { x, y, height, width } = newPos;
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

    console.log('isAvailable', isAvailable);
    if (!isAvailable) return;
    const oldChart = chartsPositions.find((c) => c.id == chart.id);
    if (!oldChart) return;
    const newChartPosition = { ...oldChart, width, height, x, y };
    updateChartPosition(chart.id, newChartPosition);
    updateContainerHeight([...allCharts, newChartPosition]);
    const xInPerc = transformPositionBetweenPxAndPerc(x, 'x', 'perc');
    const yInPerc = transformPositionBetweenPxAndPerc(y, 'y', 'perc');
    console.log('position change : ', { x, xInPerc, y, yInPerc });
    const newChartInPercent = {
      ...chart,
      height,
      width,
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
      title={chart.title}
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
            // TODO, why stringify(chartData)? would a key={chart.id} work instead?
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
      <Modal
        key={'modal' + '-' + chart.title}
        modalId={baseModalId + chart.title}
        modalChildren={
          <div key={'chart-info-' + chart.title}>
            <div>{chart.title}</div>
            <SyntaxHighlighter language='sql' style={darcula}>
              {chart.query}
            </SyntaxHighlighter>
          </div>
        }
      />
    </ResizableDraggableCard>
  );
};

export default ResizableChart;

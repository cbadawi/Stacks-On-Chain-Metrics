'use client';

import React, { useEffect, useState } from 'react';
import { convertRemToPixels } from '@/app/lib/convertRemToPixels';
import ResizableDraggableCard from './ResizableDraggableCard';
import ChartContainer from '../charts/ChartContainer';
import { ChartWithData } from '@/app/lib/db/dashboards/dashboard';
import { updateChart } from '@/app/lib/db/dashboards/charts';
import { Position, VariableType, isAvailablePosition } from '../helpers';
import { fetchData, getCookie } from '@/app/lib/fetch';
import { replaceVariables } from '@/app/lib/db/replaceVariables';
import QueryErrorContainer from '../QueryErrorContainer';
import LoadingSkeleton from '@/app/dashboards/loading';
import Modal from '../Modal';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('sql', sql);

type ResizableChartProps = {
  chart: ChartWithData;
  allCharts: ChartWithData[];
  variables: VariableType[];
  baseModalId: string;
};

const transformPositionBetweenPxAndPerc = (
  pos: number,
  xOrY: 'x' | 'y',
  targetUnit: 'px' | 'perc'
) => {
  if (typeof window == 'undefined') return pos;
  const parent = document?.getElementById('draggables-wrapper');
  if (!parent) return pos;
  const parentRect = parent.getBoundingClientRect();
  const parentDimension = xOrY == 'x' ? parentRect.width : parentRect.height;
  if (targetUnit == 'perc') return (pos / parentDimension) * 100;
  else return (pos / 100) * parentDimension;
};

const ResizableChart = ({
  chart,
  allCharts,
  variables,
  baseModalId,
}: ResizableChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(chart.width);
  const [height, setHeight] = useState(chart.height);
  // Must set positions in use effect or else chart will render on the server which has no access to document
  useEffect(() => {
    setX(transformPositionBetweenPxAndPerc(chart.x, 'x', 'px'));
    setY(transformPositionBetweenPxAndPerc(chart.y, 'y', 'px'));
  }, []);

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

  const allChartsInPx = allCharts.map((c) => {
    return {
      ...c,
      x: transformPositionBetweenPxAndPerc(c.x, 'x', 'px'),
      y: transformPositionBetweenPxAndPerc(c.y, 'y', 'px'),
    };
  });

  const chartUpdateHandler = ({ width, height, x, y }: Position) => {
    const isAvailable = isAvailablePosition(
      {
        id: chart.id,
        width,
        height,
        x,
        y,
      },
      allChartsInPx
    );
    if (!isAvailable) return;
    setX(x);
    setY(y);
    setHeight(height);
    setWidth(width);
    const xInPerc = transformPositionBetweenPxAndPerc(x, 'x', 'perc');
    const yInPerc = transformPositionBetweenPxAndPerc(y, 'y', 'perc');
    const newChart = {
      ...chart,
      height,
      width,
      x: xInPerc,
      y: yInPerc,
    };
    updateChart(newChart);
  };
  return (
    <ResizableDraggableCard
      title={chart.title}
      query={chart.query}
      baseModalId={baseModalId}
      x={x}
      y={y}
      height={height}
      width={width}
      titleHeaderHeightRem={titleHeaderHeightRem}
      titleHeaderPaddingRem={titleHeaderPaddingRem}
      childrenHorizontalPaddingRem={childrenHorizontalPaddingRem}
      chartUpdateHandler={chartUpdateHandler}
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
            chartAxesTypes={chart.axesTypes}
            chartColumnsTypes={chart.columnTypes}
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

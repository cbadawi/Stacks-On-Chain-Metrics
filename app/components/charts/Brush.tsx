/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useRef, useState, useMemo } from 'react';
import { scaleTime, scaleLinear } from '@visx/scale';
import { Brush } from '@visx/brush';
import { Bounds } from '@visx/brush/lib/types';
import BaseBrush, {
  BaseBrushState,
  UpdateBrush,
} from '@visx/brush/lib/BaseBrush';
import { PatternLines } from '@visx/pattern';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { max, extent } from '@visx/vendor/d3-array';
import { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import BaseChart from './BaseChart';
import { ChartType } from '../query/QueryVisualization';

const brushMargin = { top: 50, bottom: 0, left: 50, right: 20 };
const chartSeparation = 30;
// Maybe keep the gradient on the query page but remove it for the dashboards
const PATTERN_ID = 'brush_pattern';
const GRADIENT_ID = 'brush_gradient';
export const accentColor = '#f6acc8';
export const background = '#584153';
export const background2 = '#af8baf';
const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: 'white',
};

export type Scales = typeof scaleLinear | typeof scaleTime;

/**
 * Checks if the value should be plotted as an int
 */
const isNum = (value: any) => !isNaN(value) && !(value instanceof Date);
/**
 * Checks if the value should be plotted as date
 */
const isDate = (value: any) => new Date(value) instanceof Date;

export type BrushProps = {
  data: any[];
  chartType?: ChartType;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  compact?: boolean;
};

function BrushChart({
  data,
  width = 900,
  height = 700,
  chartType = ChartType.line,
  margin = {
    top: 20,
    left: 80,
    bottom: 0,
    right: 50,
  },
}: BrushProps) {
  console.log('rending brushss');
  const brushRef = useRef<BaseBrush | null>(null);
  const [filteredData, setFilteredData] = useState(data);

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = chartSeparation + 20; // need seperation to make room for the x-axis title
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // brush bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0
  );

  // data
  const columns = Object.keys(data[0]);
  const xName = columns[0];
  const yNames = columns.slice(1);
  const firstYCol = yNames[0];
  const xScaleCallback = getScaleCallback(data, xName)!;
  const yScaleCallback = getScaleCallback(data, firstYCol)!;
  const xScale = getScaleBasedOnXValue(
    filteredData,
    xName,
    xMax,
    xScaleCallback
  );
  const yScale = getScaleBasedOnYValue(
    filteredData,
    firstYCol,
    yMax,
    yScaleCallback
  );

  // In case of multi-line chart, for simplicity, the brush parameters should be depending on the first line
  // TODO the returned value would probably fail if the values are discrete or not a number, such as a category, in which case we should turn off the brush
  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const dataCopy = data.filter((d: any) => {
      const x = isNum(d[xName]) ? d[xName] : new Date(d[xName]).getTime();
      const y = d[yNames[0]];
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredData(dataCopy);
  };

  function getScaleBasedOnYValue(
    data: any[],
    yName: string,
    yMax: number,
    scale: typeof scaleLinear | typeof scaleTime
  ) {
    if (scale.name == 'createLinearScale')
      return useMemo(
        () =>
          scale<number>({
            range: [yMax, 0],
            domain: [0, max(data, (d: any) => d[yName]) || 0],
            nice: true,
          }),
        [yMax, data]
      );
    new Error(`X scale not defined for ${yName}`);
  }

  function getScaleCallback(data: any[], colName: string) {
    const value = data[0][colName];
    if (isNum(value)) return scaleLinear;
    else if (isDate(value)) return scaleTime;
    new Error(
      `Scale callback not defined for value ${value} in column ${colName}`
    );
  }

  function getScaleBasedOnXValue(
    data: any[],
    xName: string,
    xMax: number,
    scale: Scales
  ) {
    if (scale.name == 'createLinearScale')
      return useMemo(
        () =>
          scale<number>({
            range: [0, xMax],
            domain: [0, max(data, (d: any) => d[xName]) || 0],
            nice: true,
          }),
        [xMax, data]
      );
    else if (scale.name == 'createTimeScale') {
      return useMemo(
        () =>
          scale<number>({
            range: [0, xMax],
            domain: extent(data, (d: any) => new Date(d[xName])) as [
              Date,
              Date,
            ],
          }),
        [xMax, data]
      );
    }
    new Error(`X scale not defined for ${xName}`);
  }

  // Brush scales
  const brushXScale = getScaleBasedOnXValue(
    data,
    xName,
    xBrushMax,
    xScaleCallback
  )!;
  const brushYScale = getScaleBasedOnYValue(
    data,
    firstYCol,
    yBrushMax,
    yScaleCallback
  )!;

  // TODO these should be converted to date if its a date
  const parseValue = (value: any) => {
    if (isNum(value)) return value;
    else if (isDate(value)) return new Date(value);
  };

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushXScale(parseValue(data[0][xName])) },
      end: { x: brushXScale(parseValue(data[data.length - 1][xName])) },
    }),
    [brushXScale]
  );

  // event handlers
  const handleResetClick = () => {
    if (brushRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        const newExtent = brushRef.current!.getExtent(
          initialBrushPosition.start,
          initialBrushPosition.end
        );

        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: newExtent.y0, x: newExtent.x0 },
          end: { y: newExtent.y1, x: newExtent.x1 },
          extent: newExtent,
        };

        return newState;
      };
      brushRef.current.updateBrush(updater);
    }
  };

  return (
    <div>
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
        <BaseChart
          xName={xName}
          yNames={yNames}
          chartType={chartType}
          data={filteredData}
          height={height}
          width={width}
          margin={{ ...margin, bottom: topChartBottomMargin }}
          yMax={yMax}
          xScale={xScale!}
          yScale={yScale!}
          gradientColor={background2}
        />
        <BaseChart
          xName=''
          yNames={[]}
          data={data}
          height={height}
          width={width}
          yMax={yBrushMax}
          xScale={brushXScale}
          yScale={brushYScale}
          margin={brushMargin}
          top={topChartHeight + topChartBottomMargin + margin.top}
          gradientColor={background2}
        >
          <PatternLines
            id={PATTERN_ID}
            height={8}
            width={8}
            stroke={accentColor}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <Brush
            xScale={brushXScale}
            yScale={brushYScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            handleSize={8}
            innerRef={brushRef}
            resizeTriggerAreas={['left', 'right']}
            brushDirection='horizontal'
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredData(data)}
            selectedBoxStyle={selectedBrushStyle}
            useWindowMoveEvents
            renderBrushHandle={(props) => <BrushHandle {...props} />}
          />
        </BaseChart>
      </svg>
      <button onClick={handleResetClick}>Reset Scale</button>
    </div>
  );
}
// We need to manually offset the handles for them to be rendered at the right position
function BrushHandle({ x, height, isBrushActive }: BrushHandleRenderProps) {
  const pathWidth = 8;
  const pathHeight = 15;
  if (!isBrushActive) {
    return null;
  }
  return (
    <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
      <path
        fill='#f2f2f2'
        d='M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12'
        stroke='#999999'
        strokeWidth='1'
        style={{ cursor: 'ew-resize' }}
      />
    </Group>
  );
}

export default BrushChart;

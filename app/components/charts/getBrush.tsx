import React, { useMemo, useRef } from 'react';
import { Brush } from '@visx/brush';
import { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import { Bounds } from '@visx/brush/lib/types';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import { PatternLines } from '@visx/pattern';
import BaseChart from './BaseChart';
import {
  accentColor,
  ChartType,
  getScaleCallback,
  getXScale,
  getYScale,
  isNum,
  parseValue,
} from './helpers';
import { Group } from '@visx/group';
import BaseBrush, {
  BaseBrushState,
  UpdateBrush,
} from '@visx/brush/lib/BaseBrush';
import handleFailedScale from '@/app/lib/handleFailedScale';

const EMPTY_RESPONSE = { handleResetClick: undefined, brush: undefined };

type BrushProps = {
  showBrush: boolean;
  data: any[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  xName: string;
  yName: string;
  bottomChartHeight: number;
  topChartHeight: number;
  topChartBottomMargin: number;
  background2: string;
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
};

const getBrush = ({
  showBrush,
  data,
  xName,
  yName,
  height,
  width,
  topChartHeight,
  topChartBottomMargin,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  setFilteredData,
  bottomChartHeight,
  background2,
}: BrushProps) => {
  const brushRef = useRef<BaseBrush | null>(null);

  if (!showBrush) return EMPTY_RESPONSE;

  const brushMargin = { top: 50, bottom: 0, left: 50, right: 20 };
  // brush bounds
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0
  );

  const PATTERN_ID = 'brush_pattern';

  const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: 'white',
  };

  const xScaleCallback = getScaleCallback(data, xName, 'x', ChartType.line)!;
  const yScaleCallback = getScaleCallback(data, yName, 'y') as
    | typeof scaleLinear
    | typeof scaleTime;
  if (!xScaleCallback || !yScaleCallback)
    return handleFailedScale(xScaleCallback, data, EMPTY_RESPONSE);

  const brushXScale = getXScale(
    data,
    xName,
    xBrushMax,
    xScaleCallback,
    'x',
    ChartType.line
  )!;

  const brushYScale = getYScale(
    data,
    [yName],
    yBrushMax,
    yScaleCallback,
    ChartType.line
  )!;

  // In case of multi-line chart, for simplicity, the brush parameters should be depending on the first line
  // TODO the returned value would probably fail if the values are discrete or not a number, such as a category, in which case we should turn off the brush
  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const dataCopy = data.filter((d: any) => {
      const x = isNum(d[xName]) ? d[xName] : new Date(d[xName]).getTime();
      const y = d[yName];
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredData(dataCopy);
  };

  // TODO wrap in useMemo [brushXScale, data]
  const initialBrushPosition = {
    start: { x: brushXScale(parseValue(data[0][xName])) },
    end: { x: brushXScale(parseValue(data[data.length - 1][xName])) },
  };

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

  return {
    handleResetClick,
    brush: (
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
        top={topChartHeight + topChartBottomMargin + (margin?.top || 0)}
        gradientColor={background2}
        hideBottomAxis={true}
        hideVerticalAxis={true}
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
          renderBrushHandle={(props: BrushHandleRenderProps) => (
            <BrushHandle {...props} />
          )}
        />
      </BaseChart>
    ),
  };
};

export default getBrush;

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

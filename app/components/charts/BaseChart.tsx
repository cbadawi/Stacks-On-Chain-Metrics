import { Bar } from '@visx/shape';
import { LinePath } from '@visx/shape';
import { GridColumns } from '@visx/grid';
import React from 'react';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom, AxisScale } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import Watermark from '../Watermark';
import { parseValue, ChartType } from './helpers';
import { ScaleBand } from '@visx/vendor/d3-scale';

// Initialize some variables
const accentColor = '#edffea';
const axisColor = '#fff';
const axisBottomTickLabelProps = {
  textAnchor: 'middle' as const,
  fontFamily: 'Arial',
  fontSize: 10,
  angle: 50,
  fill: axisColor,
};
export const axisLeftTickLabelProps = {
  dx: '-0.25em',
  dy: '0.25em',
  fontFamily: 'Arial',
  fontSize: 10,
  textAnchor: 'end' as const,
  fill: axisColor,
};

const axisLabelProps = {
  angle: 0.5,
  verticalAnchor: 'start',
  fill: 'black',
  fontSize: 20,
  // length: 50,
  textAnchor: 'middle', // Set label text anchor to the middle
  // dy: 500, // Adjust vertical positioning if needed
};

const renderData = (
  chartType: ChartType,
  xName: string,
  data: any[],
  xScale: AxisScale<number> | ScaleBand<string>,
  yScale: AxisScale<number>,
  yMax?: number,
  localPoint?: any,
  showTooltip?: any,
  handleTooltip?: (
    event:
      | React.TouchEvent<SVGRectElement | SVGPathElement>
      | React.MouseEvent<SVGRectElement | SVGPathElement>
  ) => void,
  hideTooltip?: () => void,
  yNames?: string[]
) => {
  switch (Number(chartType)) {
    case ChartType.line:
      if (yNames && yNames.length)
        return yNames.map((colName, i) => (
          <LinePath
            key={i}
            data={data}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip && hideTooltip()}
            x={(d) => xScale(parseValue(d[xName])) || 0}
            y={(d) => yScale(d[colName]) || 0}
            stroke='#fff'
          />
        ));
    case ChartType.bar:
      if (yNames && yNames.length && yMax)
        return data.map((d, index) => {
          const barWidth = (xScale as ScaleBand<string>).bandwidth();
          const barHeight = yMax - (yScale(d[yNames[0]]) ?? 0);
          const barX = xScale(d[xName]);
          const barY = yMax - barHeight;
          return (
            <Bar
              key={`bar-${index}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill='#5844C2'
              onMouseMove={(
                event:
                  | React.TouchEvent<SVGRectElement | SVGPathElement>
                  | React.MouseEvent<SVGRectElement | SVGPathElement>
              ) => {
                const eventSvgCoords = localPoint(event);
                const left = barX;
                showTooltip({
                  tooltipData: d,
                  tooltipTop: eventSvgCoords?.y,
                  tooltipLeft: left,
                });
              }}
              onMouseLeave={() => hideTooltip && hideTooltip()}
            />
          );
        });
  }
};

interface BaseChartProps {
  chartType?: ChartType;
  xName: string;
  yNames?: string[];
  data: any[];
  gradientColor: string;
  xScale: AxisScale<number> | ScaleBand<number>;
  yScale: AxisScale<number>;
  height: number;
  width: number;
  yMax: number;
  margin: { top: number; right: number; bottom: number; left: number };
  top?: number;
  handleTooltip?: any;
  hideTooltip?: () => void;
  hideBottomAxis?: boolean;
  hideLeftAxis?: boolean;
  localPoint?: any;
  showTooltip?: any;
  showGrid?: boolean;
  children?: React.ReactNode;
}

export default function BaseChart({
  chartType = ChartType.line,
  yNames, // column names that contain the y-values
  xName, // name on the x-axis
  data,
  gradientColor,
  height,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  top,
  handleTooltip,
  hideTooltip,
  hideBottomAxis,
  hideLeftAxis,
  localPoint,
  showTooltip,
  showGrid,
  children, // used for the brush chart
}: BaseChartProps) {
  if (width < 10) return null;
  hideLeftAxis = hideLeftAxis || Boolean(!yNames?.length); // hide y axis if more than 1 y column or none
  return (
    <Group left={margin.left} top={top || margin.top}>
      <LinearGradient
        id='gradient'
        from={gradientColor}
        fromOpacity={1}
        to={gradientColor}
        toOpacity={0.2}
      />
      {showGrid && (
        <GridColumns
          top={margin.top}
          scale={xScale}
          height={innerHeight}
          strokeDasharray='1,3'
          stroke={accentColor}
          strokeOpacity={0.2}
          pointerEvents='none'
        />
      )}
      {renderData(
        chartType,
        xName,
        data,
        xScale,
        yScale,
        yMax,
        localPoint,
        showTooltip,
        handleTooltip,
        hideTooltip,
        yNames
      )}
      <Watermark height={height} width={width} />
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={axisBottomTickLabelProps}
          label={xName}
          tickFormat={(v) => (v.length > 10 ? v.slice(0, 7) + '..' : v)}
          labelProps={axisLabelProps as any}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={axisLeftTickLabelProps}
          tickFormat={(v) =>
            !isNaN(v) && v > 1000
              ? Number(v).toExponential()
              : v.length > 10
                ? v.slice(0, 7) + '..'
                : v
          }
          label={!hideLeftAxis && yNames?.length ? yNames![0] : ''}
          labelProps={axisLabelProps as any}
        />
      )}
      {children}
    </Group>
  );
}

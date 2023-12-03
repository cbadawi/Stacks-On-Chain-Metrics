import { LinePath } from '@visx/shape';
import { GridColumns } from '@visx/grid';
import React from 'react';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom, AxisScale } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import Watermark from '../Watermark';
import { ChartType } from '../query/QueryVisualization';
import { parseValue } from './helpers';

// Initialize some variables
const accentColor = '#edffea';
const axisColor = '#fff';
const axisBottomTickLabelProps = {
  textAnchor: 'middle' as const,
  fontFamily: 'Arial',
  fontSize: 10,
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
  fill: '#fff',
  fontSize: 20,
  textAnchor: 'middle', // Set label text anchor to the middle
  dy: '0', // Adjust vertical positioning if needed
};

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
  children, // used for the brush chart
}: {
  chartType?: ChartType;
  xName: string;
  yNames?: string[];
  data: any[];
  gradientColor: string;
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  height: number;
  width: number;
  yMax: number;
  margin: { top: number; right: number; bottom: number; left: number };
  top?: number;
  handleTooltip?: any;
  hideTooltip?: any;
  hideBottomAxis?: boolean;
  children?: React.ReactNode;
}) {
  if (width < 10) return null;
  const hideLeftAxis = Boolean(!yNames?.length); // hide y axis if more than 1 y column or none
  return (
    <Group left={margin.left} top={top || margin.top}>
      <LinearGradient
        id='gradient'
        from={gradientColor}
        fromOpacity={1}
        to={gradientColor}
        toOpacity={0.2}
      />
      <GridColumns
        top={margin.top}
        scale={xScale}
        height={innerHeight}
        strokeDasharray='1,3'
        stroke={accentColor}
        strokeOpacity={0.2}
        pointerEvents='none'
      />
      {yNames &&
        yNames.map((colName, i) => (
          <LinePath
            key={i}
            data={data}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
            x={(d) => xScale(parseValue(d[xName])) || 0}
            y={(d) => yScale(d[colName]) || 0}
            stroke='#fff'
          />
        ))}
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
          label={!hideLeftAxis && yNames?.length ? yNames![0] : ''}
          labelProps={axisLabelProps as any}
        />
      )}
      {children}
    </Group>
  );
}

import { Bar } from '@visx/shape';
import { LinePath, BarStack } from '@visx/shape';
import { GridColumns } from '@visx/grid';
import React from 'react';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom, AxisScale } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import { scaleOrdinal } from '@visx/scale';

import Watermark from '../Watermark';
import {
  parseValue,
  ChartType,
  colors,
  MarginObject,
  customizableChartOptions,
  CustomizableChartOptions,
  getBarAndLineColNames,
} from './helpers';
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
  xMax?: number,
  yMax?: number,
  localPoint?: any,
  showTooltip?: any,
  handleTooltip?: (
    event:
      | React.TouchEvent<SVGRectElement | SVGPathElement>
      | React.MouseEvent<SVGRectElement | SVGPathElement>
  ) => void,
  hideTooltip?: () => void,
  yNames?: string[],
  customizableColumnsTypes?: CustomizableChartOptions[]
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
      if (!yNames) return;
      const names = [...yNames] as const;
      type YNamesUnion = (typeof names)[number];
      const colorScale = scaleOrdinal<YNamesUnion, string>({
        domain: yNames,
        range: colors.slice(0, yNames!.length),
      });
      let barYNames: string[] = [];
      let lineYNames: string[] = [];
      if (customizableColumnsTypes)
        ({ barYNames, lineYNames } = getBarAndLineColNames(
          customizableColumnsTypes,
          yNames
        ));
      const bars = barYNames?.length ? barYNames : yNames;
      return (
        <>
          {bars?.length && (
            <BarStack
              data={data}
              keys={bars}
              x={(d: any) => d[xName]}
              xScale={xScale}
              yScale={yScale}
              color={colorScale}
            >
              {(barStacks) => {
                return barStacks.map((barStack, index) =>
                  barStack.bars.map((bar, barIndex) => (
                    <rect
                      key={`bar-${index}-${barIndex}`}
                      x={bar.x}
                      y={bar.y}
                      height={bar.height}
                      width={bar.width}
                      fill={bar.color}
                      onMouseMove={(
                        event:
                          | React.TouchEvent<SVGRectElement | SVGPathElement>
                          | React.MouseEvent<SVGRectElement | SVGPathElement>
                      ) => {
                        const eventSvgCoords = localPoint(event);
                        const left = bar.x;
                        showTooltip({
                          tooltipData: bar.bar.data,
                          tooltipTop: eventSvgCoords?.y,
                          tooltipLeft: left + bar.width,
                        });
                      }}
                      onMouseLeave={() => hideTooltip && hideTooltip()}
                    />
                  ))
                );
              }}
            </BarStack>
          )}
          {lineYNames?.length &&
            lineYNames.map((colName, i) => (
              <LinePath
                key={i}
                data={data}
                x={(d) => xScale(parseValue(d[xName])) || 0}
                y={(d) => yScale(d[colName]) || 0}
                stroke='#fff'
              />
            ))}
        </>
      );
  }
};

interface BaseChartProps {
  chartType?: ChartType;
  xName: string;
  yNames?: string[];
  customizableColumnsTypes?: CustomizableChartOptions[];
  data: any[];
  gradientColor: string;
  xScale: AxisScale<number> | ScaleBand<number>;
  yScale: AxisScale<number>;
  height: number;
  width: number;
  xMax?: number;
  yMax: number;
  margin: MarginObject;
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
  xName, // name on the x-axis
  yNames, // column names that contain the y-values
  customizableColumnsTypes,
  data,
  gradientColor,
  height,
  width,
  xMax,
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
        xMax,
        yMax,
        localPoint,
        showTooltip,
        handleTooltip,
        hideTooltip,
        yNames,
        customizableColumnsTypes
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

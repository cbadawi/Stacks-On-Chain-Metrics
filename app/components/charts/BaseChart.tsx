import { LinePath, BarStack } from '@visx/shape';
import { GridColumns } from '@visx/grid';
import React from 'react';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom, AxisScale, AxisRight } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import { scaleOrdinal } from '@visx/scale';

import Watermark from '../Watermark';
import {
  parseValue,
  ChartType,
  colors,
  MarginObject,
  ChartConfigs,
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

const axisVerticalTickLabelProps = {
  dy: '0.25em',
  fontFamily: 'Arial',
  fontSize: 7,
  textAnchor: 'end' as const,
  fill: axisColor,
};

export const axisLeftTickLabelProps = {
  dx: '-0.25em',
  ...axisVerticalTickLabelProps,
};

export const axisRightTickLabelProps = {
  dx: '1.5em',
  ...axisVerticalTickLabelProps,
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
  yScaleLeft?: AxisScale<number>,
  yScaleRight?: AxisScale<number>,
  localPoint?: any,
  showTooltip?: any,
  handleTooltip?: (
    event:
      | React.TouchEvent<SVGRectElement | SVGPathElement>
      | React.MouseEvent<SVGRectElement | SVGPathElement>
  ) => void,
  hideTooltip?: () => void,
  yNames?: string[],
  chartConfigs?: ChartConfigs
) => {
  switch (Number(chartType)) {
    case ChartType.line:
      if (yNames && yNames?.length && yScale)
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
      if (!yNames || !yScale) return;
      if (!yScaleLeft && !yScaleRight) return;
      const names = [...yNames] as const;
      type YNamesUnion = (typeof names)[number];
      const colorScale = scaleOrdinal<YNamesUnion, string>({
        domain: yNames,
        range: colors.slice(0, yNames!.length),
      });

      const barNames = chartConfigs?.barColumnNames?.length
        ? chartConfigs.barColumnNames
        : [];
      const lineNames = chartConfigs?.lineColumnNames?.length
        ? chartConfigs.lineColumnNames
        : [];
      const rightAxesNames = chartConfigs?.rightAxisColumnNames?.length
        ? chartConfigs.rightAxisColumnNames
        : [];
      const leftAxesNames = chartConfigs?.leftAxisColumnNames?.length
        ? chartConfigs.leftAxisColumnNames
        : [];
      return (
        <>
          {barNames?.length && (
            <BarStack
              data={data}
              keys={barNames}
              x={(d: any) => d[xName]}
              xScale={xScale}
              yScale={yScale} // set yScale here since it covers all columns
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
          {lineNames.length &&
            lineNames.map((colName, i) => (
              <LinePath
                key={i}
                data={data}
                x={(d) => xScale(parseValue(d[xName])) || 0}
                y={(d) =>
                  yScaleRight && rightAxesNames.find((c) => c == colName)
                    ? yScaleRight(d[colName]) || 0
                    : yScaleLeft && leftAxesNames.find((c) => c == colName)
                      ? yScaleLeft(d[colName]) || 0
                      : 0
                }
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
  chartConfigs?: ChartConfigs;
  data: any[];
  gradientColor: string;
  xScale: AxisScale<number> | ScaleBand<number>;
  yScale: AxisScale<number>;
  yScaleLeft?: AxisScale<number>;
  yScaleRight?: AxisScale<number>;
  height: number;
  width: number;
  xMax?: number;
  yMax: number;
  margin: MarginObject;
  top?: number;
  handleTooltip?: any;
  hideTooltip?: () => void;
  hideBottomAxis?: boolean;
  hideVerticalAxis?: boolean;
  localPoint?: any;
  showTooltip?: any;
  showGrid?: boolean;
  children?: React.ReactNode;
}

export default function BaseChart({
  chartType = ChartType.line,
  xName, // name on the x-axis
  yNames, // column names that contain the y-values
  chartConfigs,
  data,
  gradientColor,
  height,
  width,
  xMax,
  yMax,
  margin,
  xScale,
  yScale,
  yScaleLeft,
  yScaleRight,
  top,
  handleTooltip,
  hideTooltip,
  hideBottomAxis,
  hideVerticalAxis,
  localPoint,
  showTooltip,
  showGrid,
  children, // used for the brush chart
}: BaseChartProps) {
  if (width < 10) return null;
  hideVerticalAxis = hideVerticalAxis; //|| yNames?.length == 0;
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
        yScaleLeft,
        yScaleRight,
        localPoint,
        showTooltip,
        handleTooltip,
        hideTooltip,
        yNames,
        chartConfigs
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
      {!hideVerticalAxis && (yScale || yScaleLeft) && (
        <AxisLeft
          scale={yScaleLeft || yScale}
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
          label={
            !hideVerticalAxis && chartConfigs?.leftAxisColumnNames?.length
              ? chartConfigs.leftAxisColumnNames![0]
              : ''
          }
          labelProps={axisLabelProps as any}
        />
      )}
      {!hideVerticalAxis && yScaleRight && (
        <AxisRight
          scale={yScaleRight}
          numTicks={5}
          stroke={axisColor}
          left={width - margin.right - margin.left}
          tickStroke={axisColor}
          tickLabelProps={axisRightTickLabelProps}
          tickFormat={(v) =>
            !isNaN(v) && v > 1000
              ? Number(v).toExponential()
              : v.length > 10
                ? v.slice(0, 7) + '..'
                : v
          }
          label={
            !hideVerticalAxis && chartConfigs?.rightAxisColumnNames?.length
              ? chartConfigs.rightAxisColumnNames![0]
              : ''
          }
          labelProps={axisLabelProps as any}
        />
      )}
      {children}
    </Group>
  );
}

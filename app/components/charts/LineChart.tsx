import React, { useCallback, useState } from 'react';
import { bisector } from '@visx/vendor/d3-array';
import {
  ChartType,
  getScaleCallback,
  getXScale,
  getYScale,
  parseValue,
} from './helpers';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import { localPoint } from '@visx/event';

import BaseChart from './BaseChart';
import { ScaleLinear, ScaleTime } from '@visx/vendor/d3-scale';
import getBrush from './getBrush';
import handleFailedScale from '@/app/lib/handleFailedScale';

interface LineChartProps {
  data: any[];
  xName: string;
  yNames: string[];
  chartType: ChartType;
  xMax: number;
  yMax: number;
  height: number;
  width: number;
  hideTooltip: () => void;
  showTooltip: any;
}

const LineChart = ({
  data,
  xName,
  yNames,
  chartType,
  xMax,
  yMax,
  height,
  width,
  showTooltip,
  hideTooltip,
}: LineChartProps) => {
  const margin = {
    top: 50,
    left: 80,
    bottom: 0,
    right: 50,
  };

  const chartSeparation = 30;

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = chartSeparation + 20; // need seperation to make room for the x-axis title
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // Styles
  const background2 = '#af8baf';

  const firstYName = yNames[0];
  const bisectData = bisector<any, any>((d) => parseValue(d[xName])).left;
  const xScaleCallback = getScaleCallback(data, xName, 'x', chartType)!;
  const yScaleCallback = getScaleCallback(data, firstYName, 'y') as
    | typeof scaleLinear
    | typeof scaleTime;
  if (!xScaleCallback || !yScaleCallback)
    return handleFailedScale(xScaleCallback, data);

  const xScale = getXScale(data, xName, xMax, xScaleCallback, 'x', chartType)!;
  const yScale = getYScale(data, yNames, yMax, yScaleCallback, chartType)!;

  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      if (!xScale || !yScale) return null;
      const { x } = localPoint(event) || { x: 0 };
      const x0 = (xScale as
        | ScaleLinear<number, number, never>
        | ScaleTime<number, number, never>)!.invert(x - margin.left); // margin.left is subtracted to account for the chart margins
      const index = bisectData(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && parseValue(d1[xName])) {
        d =
          x0.valueOf() - parseValue(d0[xName]).valueOf() >
          parseValue(d1[xName]).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(d[firstYName]),
      });
    },
    [showTooltip, yScale, xScale]
  );
  return (
    <BaseChart
      xName={xName}
      yNames={yNames}
      chartType={chartType}
      data={data}
      height={Number(height)}
      width={Number(width)}
      margin={{ ...margin, bottom: topChartBottomMargin }}
      yMax={yMax}
      xScale={xScale}
      yScale={yScale}
      localPoint={localPoint}
      showTooltip={showTooltip}
      gradientColor={background2}
      handleTooltip={handleTooltip}
      hideTooltip={hideTooltip}
      showGrid={true}
    />
  );
};

export default LineChart;

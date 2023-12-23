import React, { useCallback, useState } from 'react';
import { bisector } from '@visx/vendor/d3-array';
import {
  MarginObject,
  getScaleCallback,
  getXScale,
  getYScale,
  parseValue,
} from '../helpers';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import { localPoint } from '@visx/event';

import BaseChart from './BaseChart';
import { ScaleLinear, ScaleTime } from '@visx/vendor/d3-scale';
import handleFailedScale from '@/app/lib/handleFailedScale';
import { ChartType } from '@prisma/client';

interface LineChartProps {
  data: any[];
  xName: string;
  yNames: string[];
  chartType: ChartType;
  margin: MarginObject;
  xMax: number;
  yMax: number;
  height: number;
  width: number;
  hideTooltip: () => void;
  showTooltip: any;
  errorHandler?: (msg: string) => void;
}

const LineChart = ({
  data,
  xName,
  yNames,
  chartType,
  margin,
  xMax,
  yMax,
  height,
  width,
  showTooltip,
  hideTooltip,
  errorHandler,
}: LineChartProps) => {
  // chart margin between the chart and the svg
  // Styles
  const background2 = '#af8baf';

  const firstYName = yNames[0];
  const bisectData = bisector<any, any>((d) => parseValue(d[xName])).left;
  const xScaleCallback = getScaleCallback(data, xName, 'x', chartType)!;
  const yScaleCallback = getScaleCallback(data, firstYName, 'y') as
    | typeof scaleLinear
    | typeof scaleTime;
  if (!xScaleCallback || !yScaleCallback) {
    if (errorHandler) errorHandler('Data not suitable for Line chart.');
    return handleFailedScale(xScaleCallback, data);
  }
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
      margin={margin}
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

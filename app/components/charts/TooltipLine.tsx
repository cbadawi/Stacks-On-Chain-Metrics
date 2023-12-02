import React from 'react';
import { Line } from '@visx/shape';

type TooltipLineProps = {
  tooltipTop: number;
  tooltipLeft: number;
  circleFill: string;
  lineStroke: string;
  marginTop: number;
};

const TooltipLine = ({
  tooltipTop,
  tooltipLeft,
  circleFill,
  lineStroke,
  marginTop,
}: TooltipLineProps) => {
  return (
    <g>
      <Line
        from={{ x: tooltipLeft, y: marginTop }}
        to={{ x: tooltipLeft, y: innerHeight + marginTop }}
        stroke={lineStroke}
        strokeWidth={2}
        pointerEvents='none'
        strokeDasharray='5,2'
      />
      <circle
        cx={tooltipLeft}
        cy={tooltipTop + marginTop}
        r={4}
        fill={circleFill}
        stroke='white'
        strokeWidth={2}
        pointerEvents='none'
      />
    </g>
  );
};

export default TooltipLine;

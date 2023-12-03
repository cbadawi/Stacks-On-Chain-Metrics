import React from 'react';

import {
  withTooltip,
  TooltipWithBounds,
  defaultStyles,
  Tooltip,
} from '@visx/tooltip';
import { parseValue } from './helpers';

const background = '#3b6978';

const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

const formatTooltipData = (value: any) => JSON.stringify(parseValue(value));

type TooltipDataProps = {
  tooltipTop: number;
  tooltipLeft: number;
  tooltipData: Record<string, any>;
  xName: string;
  firstYName: string;
  marginTop: number;
  innerHeight: number;
};

const TooltipData = ({
  tooltipTop,
  tooltipLeft,
  tooltipData,
  xName,
  firstYName,
  marginTop,
  innerHeight,
}: TooltipDataProps) => {
  return (
    <div>
      <TooltipWithBounds
        key={Math.random()}
        top={tooltipTop}
        left={tooltipLeft}
        style={tooltipStyles}
      >
        {formatTooltipData(tooltipData[firstYName])}
      </TooltipWithBounds>
      <Tooltip
        top={innerHeight + marginTop - 14}
        left={tooltipLeft}
        style={{
          ...defaultStyles,
          minWidth: 72,
          textAlign: 'center',
          transform: 'translateX(-50%)',
        }}
      >
        {formatTooltipData(tooltipData[xName])}
      </Tooltip>
    </div>
  );
};

export default TooltipData;

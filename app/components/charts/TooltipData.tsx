import React from 'react';

import {
  withTooltip,
  TooltipWithBounds,
  defaultStyles,
  Tooltip,
} from '@visx/tooltip';

const background = '#3b6978';

const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

const formatXTooltipData = (value: any) => JSON.stringify(new Date(value));

type TooltipDataProps = {
  tooltipTop: number;
  tooltipLeft: number;
  tooltipData: Record<string, any>;
  xName: string;
  firstYName: string;
  marginTop: number;
};

const TooltipData = ({
  tooltipTop,
  tooltipLeft,
  tooltipData,
  xName,
  firstYName,
  marginTop,
}: TooltipDataProps) => {
  return (
    <div>
      <TooltipWithBounds
        key={Math.random()}
        top={tooltipTop}
        left={tooltipLeft}
        style={tooltipStyles}
      >
        {tooltipData[firstYName as string]}
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
        {formatXTooltipData(tooltipData[xName])}
      </Tooltip>
    </div>
  );
};

export default TooltipData;

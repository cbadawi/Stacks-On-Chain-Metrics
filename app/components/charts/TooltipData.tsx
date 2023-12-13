import React from 'react';
import { colors, parseValue } from './helpers';
import { TooltipInPortalProps } from '@visx/tooltip/lib/hooks/useTooltipInPortal';

const formatTooltipData = (value: any) => JSON.stringify(parseValue(value));

type TooltipDataProps = {
  tooltipTop: number;
  tooltipLeft: number;
  tooltipData: Record<string, any>;
  xName: string;
  yNames: string[];
  TooltipInPortal: React.FC<TooltipInPortalProps>;
};

const TooltipData = ({
  TooltipInPortal,
  tooltipTop,
  tooltipLeft,
  tooltipData,
  xName,
  yNames,
}: TooltipDataProps) => {
  return (
    <TooltipInPortal top={tooltipTop} left={tooltipLeft}>
      <div style={{ color: 'black' }}>
        <strong>{xName + ' : ' + formatTooltipData(tooltipData[xName])}</strong>
      </div>
      {yNames.map((y, index) => {
        return (
          <div key={'tooltipdata-' + index} style={{ color: colors[index] }}>
            {y + ' : ' + formatTooltipData(tooltipData[y])}
          </div>
        );
      })}
    </TooltipInPortal>
  );
};

export default TooltipData;

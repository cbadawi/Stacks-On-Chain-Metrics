import React from 'react';

export interface WatermarkProps {
  width: number;
  height: number;
}

const Watermark = ({ width, height }: WatermarkProps) => {
  return (
    <text
      x='60%'
      y='45%'
      fill='rgba(0, 0, 0, 0.35)'
      fontSize={width / 30}
      textAnchor='end'
      dominantBaseline='middle'
    >
      stacksmetrics.com
    </text>
  );
};

export default Watermark;

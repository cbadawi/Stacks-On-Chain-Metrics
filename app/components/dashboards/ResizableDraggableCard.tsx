import React from 'react';
import { Rnd } from 'react-rnd';
import { Position } from '../helpers';

type ResizableDraggableCardProps = {
  title: string;
  titleHeaderHeightRem: number;
  titleHeaderPaddingRem: number;
  childrenHorizontalPaddingRem: number;
  x: number;
  y: number;
  width: number;
  height: number;
  chartUpdateHandler: (Position: {
    height: number;
    width: number;
    x: number;
    y: number;
  }) => void;
  children?: React.ReactNode;
};

const ResizableDraggableCard = ({
  title,
  x,
  y,
  width,
  height,
  titleHeaderHeightRem,
  titleHeaderPaddingRem,
  childrenHorizontalPaddingRem,
  chartUpdateHandler,
  children,
}: ResizableDraggableCardProps) => {
  const titleHeight = `h-[${titleHeaderHeightRem}rem]`;
  const titlePadding = `p-[${titleHeaderPaddingRem}rem]`;
  const childPadding = `px-[${childrenHorizontalPaddingRem}rem]`;
  if (title == 'var test') console.log('rnd position', { x: x, y: y });
  return (
    <Rnd
      bounds='parent'
      minHeight={150}
      minWidth={150}
      dragGrid={[50, 50]} // increments
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={(e, d) => {
        chartUpdateHandler({ x: d.x, y: d.y, height, width });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        chartUpdateHandler({
          x,
          y,
          height: parseInt(ref.style.height.replace('px', '')),
          width: parseInt(ref.style.width.replace('px', '')),
        });
      }}
      className='flex items-center justify-center border border-gray-700 bg-[#141414]'
    >
      <div className='h-full w-full'>
        {title && (
          <div
            className={`card-title ${titleHeight} ${titlePadding} text-lg font-normal`}
          >
            {title}
          </div>
        )}
        <div className={`card-children ${childPadding}`}>{children}</div>
      </div>
    </Rnd>
  );
};

export default ResizableDraggableCard;

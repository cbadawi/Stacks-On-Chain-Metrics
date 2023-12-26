import React from 'react';
import { Rnd } from 'react-rnd';
import { Position } from '../helpers';

type ResizableDraggableCardProps = {
  title: string;
  cardProperties: Position;
  titleHeaderHeightRem: number;
  titleHeaderPaddingRem: number;
  childrenHorizontalPaddingRem: number;
  defaultPosition: Position;
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
  cardProperties,
  titleHeaderHeightRem,
  titleHeaderPaddingRem,
  childrenHorizontalPaddingRem,
  chartUpdateHandler,
  defaultPosition,
  children,
}: ResizableDraggableCardProps) => {
  const titleHeight = `h-[${titleHeaderHeightRem}rem]`;
  const titlePadding = `p-[${titleHeaderPaddingRem}rem]`;
  const childPadding = `px-[${childrenHorizontalPaddingRem}rem]`;
  return (
    <Rnd
      bounds='parent'
      minHeight={150}
      minWidth={150}
      dragGrid={[50, 50]} // increments
      onResizeStop={(e, direction, ref, delta, position) => {
        const newPos = {
          height: parseInt(ref.style.height.replace('px', '')),
          width: parseInt(ref.style.width.replace('px', '')),
          x: position.x,
          y: position.y,
        };
        chartUpdateHandler(newPos);
      }}
      // x & y are realtive to the parent
      onDragStop={(e, data) => {
        const newPos = {
          height: cardProperties.height,
          width: cardProperties.width,
          x: data.x,
          y: data.y,
        };
        chartUpdateHandler(newPos);
      }}
      className='flex items-center justify-center border border-gray-700 bg-[#141414]'
      default={defaultPosition}
      position={defaultPosition}
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

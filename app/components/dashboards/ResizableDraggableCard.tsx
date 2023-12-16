import React from 'react';
import { Rnd } from 'react-rnd';
import { CardProperties } from './DraggablesWrapper';

type ResizableDraggableCardProps = {
  title: string;
  height: number;
  width: number;
  setCardProperties: React.Dispatch<React.SetStateAction<CardProperties>>;
  titleHeaderHeightRem: number;
  titleHeaderPaddingRem: number;
  childrenHorizontalPaddingRem: number;
  children?: React.ReactNode;
};

const ResizableDraggableCard = ({
  title,
  height,
  width,
  setCardProperties,
  titleHeaderHeightRem,
  titleHeaderPaddingRem,
  childrenHorizontalPaddingRem,
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
      onResize={(e, direction, ref, delta, position) => {
        setCardProperties({
          height: parseInt(ref.style.height.replace('px', '')),
          width: parseInt(ref.style.width.replace('px', '')),
        });
      }}
      // x & y are realtive to the parent
      onDragStop={(e, data) => {
        console.log(`New X position: ${data.x}`);
        console.log(`New Y position: ${data.y}`);
      }}
      className='flex items-center justify-center border border-gray-300 bg-gray-900'
      // enableResizing={false}
      // disableDragging={true}
      default={{
        x: 0,
        y: 0,
        width,
        height,
      }}
    >
      <div className='h-full w-full'>
        {title && (
          <div
            className={`card-title ${titleHeight} ${titlePadding} text-lg font-normal`}
          >
            Card Title
          </div>
        )}
        <div className={`card-children ${childPadding}`}>{children}</div>
      </div>
    </Rnd>
  );
};

export default ResizableDraggableCard;

import React from 'react';
import { Rnd } from 'react-rnd';

type ResizableDraggableCardProps = {
  children?: React.ReactNode;
};

const ResizableDraggableCard = ({ children }: ResizableDraggableCardProps) => {
  return (
    <Rnd
      dragGrid={[50, 50]}
      enableResizing={false}
      className='flex items-center justify-center border border-gray-300 bg-gray-900'
      disableDragging={true}
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200,
      }}
    >
      <div className='h-full w-full'>
        <div className='p-2.5 text-lg font-normal'>Card Title</div>
        <div className='p-2.5'>{children}</div>
      </div>
    </Rnd>
  );
};

export default ResizableDraggableCard;

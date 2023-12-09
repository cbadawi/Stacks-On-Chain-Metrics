import React from 'react';

type DraggableCardProps = {
  height: string;
  width: string;
  children: React.ReactNode;
};

const DraggableCard = ({ height, width, children }: DraggableCardProps) => {
  const cardClass = `draggable ${height} ${width} cursor-grabbing border-2 border-black bg-[#1E2122] p-2 m-4`;
  return (
    <div draggable={true} className={cardClass}>
      <div className='card bg-neutral text-neutral-content'>
        <div className='card-body items-center text-center'>
          <h2 className='card-title'>Title!</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DraggableCard;

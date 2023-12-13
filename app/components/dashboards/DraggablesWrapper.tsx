'use client';

import React from 'react';
import { convertRemToPixels } from '@/app/lib/convertRemToPixels';
import ResizableDraggableCard from './ResizableDraggableCard';
import ChartContainer from '../charts/ChartContainer';

const DraggablesWrapper = () => {
  const query = `select block_height, count(1) from transactions group by 1 order by 1 limit 50`;
  return (
    <div className='draggables-wrapper relative'>
      <ResizableDraggableCard>
        {/* <ChartContainer /> */}
      </ResizableDraggableCard>
    </div>
  );
};

export default DraggablesWrapper;

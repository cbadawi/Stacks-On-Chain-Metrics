'use client';

import DraggableCard from '@/app/components/dashboards/DraggableCard';
import Card from '@/app/components/dashboards/DraggableCard';
import DropZone from '@/app/components/dashboards/DropZone';
import ResizableCard from '@/app/components/dashboards/ResizableCard';
import {
  Position,
  dragendEventListener,
  dragEventListener,
} from '@/app/components/dashboards/helpers';
import React, { useEffect, useState } from 'react';

type DashboardProps = {
  params: { title: string };
};

const dashboard = ({ params }: DashboardProps) => {
  const [dropzones, setDropzones] = useState<Position[]>([]);

  const DISPLAYED_DROPBOXES = 4;
  // TODO refactor to use refs (recommended) instead of dom selectors
  useEffect(() => {
    const draggables = document.querySelectorAll('.draggable');
    const wrapper = document.querySelector('.draggables-wrapper')!;
    let wrapperBoundingRect: DOMRect;
    if (wrapper) {
      // x, y are not between the viewport and the center, its to the top/left edges.
      wrapper.addEventListener('dragover', (e) => {});
      wrapperBoundingRect = wrapper.getBoundingClientRect();
    } else if (window) {
      console.error('draggables-wrapper class not found in window.');
      return;
    }

    draggables.forEach((draggable, index) => {
      const chartUniqueKey = `chart-initial-position-${params.title}-${index}`;
      draggable.addEventListener('drag', (e: Event) =>
        dragEventListener(
          e as DragEvent,
          chartUniqueKey,
          draggable,
          draggables,
          setDropzones,
          DISPLAYED_DROPBOXES
        )
      );

      draggable.addEventListener('dragend', (e: Event) =>
        dragendEventListener(
          e as DragEvent,
          chartUniqueKey,
          draggable,
          setDropzones
        )
      );
    });
  }, []);

  // TODO good idea : seems like dune has max-width:1000px sets the width to 100% -- check a dune dashboard
  return (
    <div className='inline-block h-full w-full border-2 border-solid border-red-900 p-4'>
      <header> {params.title} </header>
      <div className='draggables-wrapper relative'>
        <DraggableCard width='w-[20rem]' height='h-[15rem]'>
          {/* <ResizableCard> */}
          <p>ddd</p>
          {/* </ResizableCard> */}
        </DraggableCard>

        <DraggableCard width='w-[20rem]' height='h-[15rem]'>
          <p>2222222</p>
        </DraggableCard>
        <DraggableCard width='w-[20rem]' height='h-[15rem]'>
          <p>333333</p>
        </DraggableCard>
        <DraggableCard width='w-[20rem]' height='h-[15rem]'>
          <p>444444</p>
        </DraggableCard>
        <DraggableCard width='w-[20rem]' height='h-[15rem]'>
          <p>5555555</p>
        </DraggableCard>
        <DraggableCard width='w-[20rem]' height='h-[15rem]'>
          <p>6666666666</p>
        </DraggableCard>
        {!!dropzones.length &&
          dropzones.map((d, i) => (
            <DropZone
              key={i}
              width='w-[20rem]'
              height='h-[15rem]'
              xTransform={`${d.x}px`}
              yTransform={`${d.y}px`}
            />
          ))}
        <DropZone
          width='w-[20rem]'
          height='h-[5rem]'
          yTransform={`700px`}
          xTransform={`700px`}
        />
        <DropZone
          width='w-[20rem]'
          height='h-[5rem]'
          yTransform={`600px`}
          xTransform={`600px`}
        />

        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`500px`}
          xTransform={`500px`}
        />

        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`0px`}
          xTransform={`0px`}
        />
        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`200px`}
          xTransform={`200px`}
        />
        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`100px`}
          xTransform={`100px`}
        />
        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`300px`}
          xTransform={`300px`}
        />

        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`800px`}
          xTransform={`800px`}
        />
        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`900px`}
          xTransform={`900px`}
        />
        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`400px`}
          xTransform={`400px`}
        />
        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`1000px`}
          xTransform={`1000px`}
        />
        <DropZone
          width='w-[15rem]'
          height='h-[5rem]'
          yTransform={`1100px`}
          xTransform={`1100px`}
        />
      </div>
    </div>
  );
};

export default dashboard;

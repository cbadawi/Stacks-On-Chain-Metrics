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
import { setDefaultAutoSelectFamily } from 'net';
import React, { useEffect, useState } from 'react';

type DashboardProps = {
  params: { title: string };
};

const dashboard = ({ params }: DashboardProps) => {
  const [dropboxes, setDropboxes] = useState<Position[]>([]);

  const DISPLAYED_DROPBOXES = 8;
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

    // TODO this will do the calculations only on initial render, needs to be in a seperate hook
    const allDraggablesBoundingRects: DOMRect[] = [];

    draggables.forEach((draggable, index) => {
      allDraggablesBoundingRects.push(draggable.getBoundingClientRect());

      const chartUniqueKey = `chart-initial-position-${params.title}-${index}`;

      draggable.addEventListener('drag', (e: Event) =>
        dragEventListener(
          e as DragEvent,
          chartUniqueKey,
          draggable,
          wrapperBoundingRect,
          allDraggablesBoundingRects,
          setDropboxes,
          DISPLAYED_DROPBOXES
        )
      );

      draggable.addEventListener('dragend', (e: Event) =>
        dragendEventListener(
          e as DragEvent,
          chartUniqueKey,
          draggable,
          setDropboxes
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
        {!!dropboxes.length &&
          dropboxes.map((d, i) => (
            <DropZone
              key={i}
              width='w-[20rem]'
              height='h-[15rem]'
              xTransform={`${d.x}px`}
              yTransform={`${d.y}px`}
            />
          ))}
      </div>
    </div>
  );
};

export default dashboard;

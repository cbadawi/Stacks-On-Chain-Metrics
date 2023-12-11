'use client';

import DraggableCard from '@/app/components/dashboards/DraggableCard';
import Card from '@/app/components/dashboards/DraggableCard';
import DropZone from '@/app/components/dashboards/DropZone';
import ResizableCard from '@/app/components/dashboards/ResizableCard';
import { findAvailablePositions } from '@/app/components/dashboards/helpers';
import React, { useEffect, useState } from 'react';

type DashboardProps = {
  params: { title: string };
};

type DropboxesPositions = {
  x: number;
  y: number;
};

const saveChartInitialPosition = (
  chartUniqueKey: string,
  initialPosition: { x: number; y: number }
) => {
  if (!localStorage.getItem(chartUniqueKey))
    localStorage.setItem(chartUniqueKey, JSON.stringify(initialPosition));
};

const getChartInitialPosition = (chartUniqueKey: string) => {
  return localStorage.getItem(chartUniqueKey);
};

const dashboard = ({ params }: DashboardProps) => {
  const [dropboxes, setDropboxes] = useState<DropboxesPositions[]>([]);
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
      // @ts-ignore
      draggable.addEventListener('dragstart', (e: DragEvent) => {
        const initialPosition = { x: e.clientX, y: e.clientY };
        console.log(
          'allDraggablesBoundingRectsallDraggablesBoundingRects',
          allDraggablesBoundingRects
        );
        // TODO this index should be safe to use since the event listeners are only added once
        // But i can see a scenario where it could cause bugs, when a user exits the dashboard and comes back
        // TODO use a new unique identifier for charts such as chart title, & see when its best to clear session/local storage
        saveChartInitialPosition(chartUniqueKey, initialPosition);
        draggable.classList.add('currently-dragging');

        const draggableBoundingRect = draggable.getBoundingClientRect();
        const dropBoxesPosition = findAvailablePositions(
          draggableBoundingRect,
          wrapperBoundingRect,
          allDraggablesBoundingRects
        );
        console.log('availablePositionsavailablePositions', dropBoxesPosition);

        setDropboxes(dropBoxesPosition);

        // getAllDropZones(initialPosition);
        // findAvailablePositions(draggable.getBoundingClientRect());
      });

      draggable.addEventListener('dragend', (e: any) => {
        if (!(draggable instanceof HTMLElement)) return;
        const intialPosition = getChartInitialPosition(chartUniqueKey);
        if (!intialPosition) {
          console.error(
            `Chart initial position not found chartUniqueKey: ${chartUniqueKey}`
          );
          return;
        }
        const newX = e.clientX;
        const newY = e.clientY;
        const distanceX = newX - JSON.parse(intialPosition!).x;
        const distanceY = newY - JSON.parse(intialPosition!).y;

        // translate requires the distance moved from current position, not the final destination
        // TODO this works for only the first drag&drop since transform coordinates should be wrt to the initial position
        // we can save the initial position in local storage instead of a state hook something with the key ${dashtitle}-${chartid}
        //  if the key exists dont overwrite it.
        const transform = `translate(${distanceX}px, ${distanceY}px)`;
        draggable.style.transform = transform;
        draggable.classList.remove('currently-dragging');
      });
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
        {dropboxes.length &&
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
      {JSON.stringify(dropboxes)}
    </div>
  );
};

export default dashboard;

'use client';

import DraggableCard from '@/app/components/dashboards/DraggableCard';
import Card from '@/app/components/dashboards/DraggableCard';
import ResizableCard from '@/app/components/dashboards/ResizableCard';
import React, { useEffect, useState } from 'react';

interface Props {
  params: { title: string };
}

const saveChartInitialPosition = (
  chartUniqueKey: string,
  initialPosition: { x: number; y: number }
) => {
  if (localStorage.getItem(chartUniqueKey)) return false;
  localStorage.setItem(chartUniqueKey, JSON.stringify(initialPosition));
  return true;
};

const getChartInitialPosition = (chartUniqueKey: string) => {
  return localStorage.getItem(chartUniqueKey);
};

const dashboard = ({ params }: Props) => {
  // TODO refactor to use refs (recommended) instead of dom selectors
  useEffect(() => {
    const draggables = document.querySelectorAll('.draggable');
    const wrapper = document.querySelector('.draggables-wrapper')!;
    if (wrapper) {
      // x, y are not between the viewport and the center, its to the top/left edges.
      const { x, y, width, height } = wrapper.getBoundingClientRect();
      wrapper.addEventListener('dragover', (e) => {});
    } else if (window) console.error('draggables-wrapper class not found.');

    draggables.forEach((draggable, index) => {
      console.log(
        `draggable.getBoundingClientRect() index ${index}`,
        draggable.getBoundingClientRect()
      );
      const chartUniqueKey = `chart-initial-position-${params.title}-${index}`;
      // @ts-ignore
      draggable.addEventListener('dragstart', (e: DragEvent) => {
        const initialPosition = { x: e.clientX, y: e.clientY };
        // TODO this index should be safe to use since the event listeners are only added once
        // But i can see a scenario where it could cause bugs, when a user exits the dashboard and comes back
        // TODO use a new unique identifier for charts such as chart title, & see when its best to clear session/local storage
        saveChartInitialPosition(chartUniqueKey, initialPosition);
        draggable.classList.add('currently-dragging');
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

  return (
    <div className='p-4'>
      <header> {params.title} </header>
      <div className='draggables-wrapper absolute'>
        <DraggableCard width='w-[20rem]' height='h-[15rem]'>
          <p>ddd</p>
        </DraggableCard>
        <DraggableCard width='w-[30rem]' height='h-[25rem]'>
          <p>eeeee</p>
        </DraggableCard>
      </div>
    </div>
  );
};

export default dashboard;

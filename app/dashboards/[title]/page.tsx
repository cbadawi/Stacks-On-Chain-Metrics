import { Chart } from '.prisma/client';
import ResizableChart from '@/app/components/dashboards/ResizableChart';
import { Position, isCollidingWithOtherCharts } from '@/app/components/helpers';
import {
  DashboardWithCharts,
  getDashboard,
} from '@/app/lib/db/dashboards/dashboard';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

type DashboardProps = {
  params: { title: string };
};

// TODO i think calling a function directly would be better than getServerSideProps

const Dashboard = async ({ params }: DashboardProps) => {
  const title = decodeURIComponent(params.title);
  const dashboard = (await getDashboard(title)) as DashboardWithCharts;
  if (!dashboard) redirect('/dashboards');

  // TODO good idea : seems like dune has max-width:1000px sets the width to 100% -- check a dune dashboard
  return (
    <div className='border-2 border-solid border-red-900 px-4'>
      <header className='dahsboard-title py-8'> {title} </header>
      <h4 className='dahsboard-title py-8'> {dashboard?.description} </h4>
      {/* <DraggablesWrapper /> */}
      <div className='draggables-wrapper relative h-full min-h-[100vh] w-full'>
        {dashboard.charts.map((chart, index) => (
          <ResizableChart
            key={'chart-' + index}
            chart={chart}
            allCharts={dashboard.charts}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

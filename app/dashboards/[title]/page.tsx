import DraggablesWrapper from '@/app/components/dashboards/DraggablesWrapper';
import React from 'react';
import {
  DashboardWithCharts,
  getDashboard,
} from '@/app/lib/db/dashboards/dashboard';
import { fetchDashboardData } from './actions';
import FilterButton from '@/app/components/filter/Button';
import { useParams } from 'next/navigation';
import { GetServerSideProps } from 'next';

type DashboardProps = {
  params: { title: string };
};

// export const getServerSideProps = (async () => {
//   const params = useParams();

//   const dashboard = await getDashboard(params.title as string);
//   return { props: { dashboard } };
// }) satisfies GetServerSideProps<{ dashboard: DashboardWithCharts }>;

const Dashboard = async ({ params }: DashboardProps) => {
  // TODO good idea : seems like dune has max-width:1000px sets the width to 100% -- check a dune dashboard
  return (
    <div className='border-2 border-solid border-red-900 px-4'>
      <header className='dahsboard-title py-8'> {params.title} </header>
      <DraggablesWrapper />
    </div>
  );
};

export default Dashboard;

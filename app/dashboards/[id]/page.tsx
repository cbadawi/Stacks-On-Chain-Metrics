import {
  DashboardWithCharts,
  getDashboard,
  getDashboardAndCharts,
} from '@/app/lib/db/dashboards/dashboard';
import { redirect } from 'next/navigation';
import React from 'react';
import ChartsAndVariablesContainer from './ChartsAndVariablesContainer';

type DashboardProps = {
  params: { id: string };
};

const Dashboards = async ({ params }: DashboardProps) => {
  const id = parseInt(decodeURIComponent(params.id));
  const variablesFormId = 'variables-form';
  // todo decouple data fetching from getDashboardAndCharts
  // todo fetch data on the chart level to have one each render seperately
  const dashboard = (await getDashboardAndCharts({
    id,
  })) as DashboardWithCharts;
  if (!dashboard) redirect('/dashboards');
  return (
    <div className='flex h-full flex-col'>
      <header className='dahsboard-title mx-4 my-6 flex justify-between border-2 bg-gray-900 py-8'>
        <div>
          <h2>{dashboard.title} </h2>
          {dashboard?.description && (
            <h4 className='dahsboard-title py-4'> {dashboard?.description} </h4>
          )}
        </div>
      </header>
      <div>
        <ChartsAndVariablesContainer
          dashboard={dashboard}
          variablesFormId={variablesFormId}
        />
      </div>
    </div>
  );
};

export default Dashboards;

import ResizableChart from '@/app/components/dashboards/ResizableChart';
import { VariableType } from '@/app/components/helpers';
import Variable from '@/app/components/query/Variable';
import {
  DashboardWithCharts,
  getDashboard,
} from '@/app/lib/db/dashboards/dashboard';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';
import RunButton from './RunButton';
import ChartsVariableWrapper from './ChartsVariableWrapper';

type DashboardProps = {
  params: { title: string };
  searchParams: any;
};

const Dashboard = async ({ params, searchParams }: DashboardProps) => {
  const title = decodeURIComponent(params.title);
  const variablesFormId = 'variables-form';
  const dashboard = (await getDashboard(
    title,
    searchParams
  )) as DashboardWithCharts;
  if (!dashboard) redirect('/dashboards');
  // TODO good idea : seems like dune has max-width:1000px sets the width to 100% -- check a dune dashboard
  return (
    <div className='border-2 border-solid border-red-900 px-4'>
      <header className='dahsboard-title flex justify-between py-8'>
        <div>
          <h2>{title} </h2>
          {dashboard?.description && (
            <h4 className='dahsboard-title py-4'> {dashboard?.description} </h4>
          )}
        </div>
      </header>
      <ChartsVariableWrapper
        dashboard={dashboard}
        variablesFormId={variablesFormId}
      />
    </div>
  );
};

export default Dashboard;

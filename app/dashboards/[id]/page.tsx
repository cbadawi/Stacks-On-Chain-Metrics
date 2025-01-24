import {
  DashboardWithCharts,
  getDashboard,
  getDashboardAndCharts,
} from '@/app/lib/db/dashboards/dashboard';
import { redirect } from 'next/navigation';
import React from 'react';
import ChartsAndVariablesContainer from './ChartsAndVariablesContainer';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DashboardOptions from './DashboardOptions';
import { EditModeProvider } from './EditModeContext';

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
      <EditModeProvider>
        <Card className='mx-4 my-6 h-auto w-auto border px-6'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-3xl font-normal'>
                {dashboard.title}
              </CardTitle>
              <DashboardOptions />
            </div>
            <CardDescription>{dashboard.description}</CardDescription>
          </CardHeader>
        </Card>
        <div>
          <ChartsAndVariablesContainer
            dashboard={dashboard}
            variablesFormId={variablesFormId}
          />
        </div>
      </EditModeProvider>
    </div>
  );
};

export default Dashboards;

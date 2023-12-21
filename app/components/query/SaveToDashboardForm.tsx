'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { createNewDashboardAndChart, addChartToDashboard } from './actions';
import Button from '../filter/Button';
import { ChartType, Dashboard, Prisma } from '@prisma/client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type SaveToDashboardFormProps = {
  query: string;
  variables?: any;
  chartType: ChartType;
  saveToDashCounter: number;
};

const closeModal = () =>
  (document.getElementById('modal') as HTMLDialogElement).close();

const SaveToDashboardForm = ({
  query,
  chartType,
  variables = [],
  saveToDashCounter,
}: SaveToDashboardFormProps) => {
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [dashboardTitles, setDashboardTitles] = useState<string[]>([]);
  const [createDashboardError, setCreateDashboardError] = useState<string>('');

  useEffect(() => {
    console.log('running use effect');
    getDashboardTitles();
  }, [saveToDashCounter]);

  const { data: session, status } = useSession();

  const getDashboardTitles = async () => {
    const res = await fetch(`api/dashboards?email=dummy@`, {
      cache: 'no-cache',
    });
    const json: { dashboards: Dashboard[] } = await res.json();
    const titles = json.dashboards.map((d) => d.title);
    setDashboardTitles(titles);
  };

  // TODO
  // if (isPrivate) alert('must be a subscriber');

  const handleToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  return (
    <div>
      {dashboardTitles.length > 0 && (
        <form
          action={addChartToDashboard}
          autoComplete='off'
          className='flex flex-col items-center justify-center'
        >
          <div className='card w-96 bg-neutral text-neutral-content'>
            <div className='card-body items-center p-5 text-center'>
              <h2 className='card-title'>Dashboards:</h2>
              <div className='dashboards max-h-[8rem] w-64 overflow-y-scroll rounded border-[1px] border-gray-500'>
                {dashboardTitles.map((title, index) => (
                  <Link
                    key={'link-' + index}
                    className='flex min-h-[1.75rem] items-center justify-center hover:bg-gray-600'
                    href={'/dashboards/' + title}
                  >
                    {title}
                  </Link>
                ))}
              </div>
              <div className='card-actions justify-end'>
                <button className='btn btn-primary'>Save Chart</button>
              </div>
            </div>
          </div>
        </form>
      )}
      <form
        action={async (f) => {
          const response = await createNewDashboardAndChart(f);
          if (response.dashboard) {
            closeModal();
            // window.open(
            //   BASE_URL + `/dashboards/${response.dashboard.title}`,
            //   '_blank',
            //   'noopener,noreferrer'
            // );
          } else if (response.error) setCreateDashboardError(response.message);
        }}
        autoComplete='off'
        className='mt-5 gap-5'
      >
        <p>Create your new dashboard :</p>
        <div className='my-2 flex'>
          <input
            type='checkbox'
            name='private'
            className='toggle toggle-warning'
            checked={isPrivate}
            onChange={handleToggleChange}
          />
          <span className={isPrivate ? 'text-yellow-500' : 'text-gray-500'}>
            private dashboard
          </span>
        </div>
        <input
          required
          name='title'
          placeholder='Dashboard Title'
          type='title'
          className='input input-bordered mb-3 w-full'
        />
        <input
          name='description'
          placeholder='Optional dashboard description'
          className='textarea textarea-bordered mb-3 w-full'
        />
        <input
          required
          name='chartTitle'
          placeholder='Chart Title'
          type='title'
          className='input input-bordered mb-3 w-full'
        />
        <input value={chartType} name='chartType' type='hidden' />
        <input value={query} name='query' type='hidden' />
        <input
          value={JSON.stringify(variables)}
          name='variables'
          type='hidden'
        />
        {createDashboardError && <p>{createDashboardError}</p>}
        <Button children={<p>Create Dashboard</p>} />
      </form>
    </div>
  );
};

export default SaveToDashboardForm;

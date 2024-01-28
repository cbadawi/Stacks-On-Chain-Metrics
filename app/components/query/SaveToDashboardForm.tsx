'use client';

import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { createNewDashboardAndChart, addChartToDashboard } from './actions';
import Button from '../filter/Button';
import {
  ChartType,
  CustomizableChartTypes,
  Dashboard,
  LeftRight,
  Prisma,
} from '@prisma/client';
import { useSession } from 'next-auth/react';
import SaveToExistingDashboardForm from './SaveToExistingDashboardForm';
import { VariableType } from '../helpers';
import { NEWLINE_PLACEHOLDER } from '@/app/lib/constants';

type SaveToDashboardFormProps = {
  query: string;
  modalId: string;
  variableDefaults?: VariableType[];
  chartType: ChartType;
  saveToDashCounter: number;
  chartColumnsTypes: CustomizableChartTypes[];
  chartAxesTypes: LeftRight[];
};

const SaveToDashboardForm = ({
  query,
  modalId,
  chartType,
  variableDefaults,
  saveToDashCounter,
  chartColumnsTypes,
  chartAxesTypes,
}: SaveToDashboardFormProps) => {
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [dashboardTitles, setDashboardTitles] = useState<string[]>([]);
  const [createDashboardError, setCreateDashboardError] = useState<string>('');
  useEffect(() => {
    getDashboardTitles();
  }, [saveToDashCounter]);

  const { data: session, status } = useSession();

  const closeModal = () =>
    (document.getElementById(modalId) as HTMLDialogElement)?.close();

  // formData.get('query') removes new lines but does not add whitespaces causing syntax errors
  // TODO find out why html or formdata removes new lines
  const formattedQuery = query.replace(/\n/g, ` ${NEWLINE_PLACEHOLDER} `);

  const getDashboardTitles = async () => {
    const res = await fetch(`api/dashboards?email=dummy@`, {
      cache: 'no-cache',
    });
    const json: { dashboards: Dashboard[] } = await res.json();
    const titles = json.dashboards.map((d) => d.title);
    setDashboardTitles(titles);
  };

  if (isPrivate) {
    alert('must be a subscriber');
    setIsPrivate(false);
  }

  const handleToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  return (
    <div>
      {dashboardTitles.length > 0 && (
        <SaveToExistingDashboardForm
          closeModal={closeModal}
          query={formattedQuery}
          variableDefaults={variableDefaults}
          chartType={chartType}
          dashboardTitles={dashboardTitles}
          chartAxesTypes={chartAxesTypes}
          chartColumnsTypes={chartColumnsTypes}
        />
      )}
      <form
        action={async (f) => {
          const response = await createNewDashboardAndChart(f);
          if (response?.dashboard) {
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
            className='toggle toggle-warning mr-2'
            checked={isPrivate}
            onChange={handleToggleChange}
          />
          <span className={isPrivate ? 'text-yellow-500' : 'text-gray-500'}>
            Set to private
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
        {/* defaultValue={chartType} instead of value returns always TABLE. remove the hidden to check with defaultValue */}
        <input value={chartType} name='chartType' readOnly hidden />
        <input
          defaultValue={chartAxesTypes}
          name='chartAxesTypes'
          hidden
          readOnly
        />
        <input
          defaultValue={chartColumnsTypes}
          name='chartColumnsTypes'
          hidden
          readOnly
        />
        <input defaultValue={formattedQuery} name='query' type='hidden' />
        <input
          defaultValue={JSON.stringify(variableDefaults)}
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

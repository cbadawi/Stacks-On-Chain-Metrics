import { Dashboard } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import UserDashboardsWrapper from './UserDashboardsWrapper';
import { Tags } from '@prisma/client';
import { redirect } from 'next/navigation';

async function searchDashboards(formData: FormData) {
  'use server';
  const searchQuery = formData.get('search')?.toString();
  if (searchQuery) {
    redirect('/dashboards?search=' + searchQuery);
  }
}

const AllDashboardsWrapper = async ({
  dashboards,
}: {
  dashboards: Dashboard[];
}) => {
  const tags = Object?.values(Tags);

  return (
    <div className='all-dashboards-wrapper mt-8 flex gap-8'>
      <div className='all-dashboards w-[70%]'>
        <h2 className='ml-4'>User Dashboards : </h2>
        {dashboards.map((d, index) => {
          return (
            <Link
              key={'dash-link-' + index}
              href={'/dashboards/' + d.title}
              className='dashboard-container m-4 flex w-full cursor-pointer overflow-hidden border-solid border-orange-950 bg-orange-400 p-2 font-semibold hover:bg-orange-500'
            >
              {d.title}
            </Link>
          );
        })}
      </div>
      <UserDashboardsWrapper />
    </div>
  );
};

export default AllDashboardsWrapper;

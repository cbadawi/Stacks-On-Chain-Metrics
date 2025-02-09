'use client';

import { getDashboards } from '@/app/lib/db/dashboards/dashboard';
import { Dashboard } from '@prisma/client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const UserDashboardsWrapper = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  const fetchDashboards = async (email: string | null | undefined) => {
    if (!email) return;
    const dashboards = await getDashboards({});
    setDashboards(dashboards);
  };

  // todo use wallet connect
  useEffect(() => {
    fetchDashboards('');
  }, []);

  return (
    <div>
      {!!dashboards?.length && (
        <div className='your-dashboards-wrapper'>
          <h2>Your dashboards</h2>
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
      )}
    </div>
  );
};

export default UserDashboardsWrapper;

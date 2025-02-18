'use client';

import { getDashboards } from '@/app/lib/db/dashboards/dashboard';
import { Dashboard } from '@prisma/client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserProvider';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserDashboardsWrapper = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const { userData } = useUser();

  useEffect(() => {
    const fetchDashboards = async (address?: string) => {
      console.log('UserDashboardsWrapper', {
        address,
        userData, // userData is null
      });
      if (!address) return;
      const dashboards = await getDashboards({ address });
      setDashboards(dashboards.response ?? []);
    };

    const address = userData?.profile.stxAddress.mainnet;
    fetchDashboards(address);
  }, [userData]);

  if (!userData) return null;

  return (
    <div>
      <CardHeader>
        <CardTitle className='text-2xl font-normal'>Your Dashboards</CardTitle>
      </CardHeader>
      <CardContent>
        {!dashboards?.length && (
          <p className='text-slate-400'>You have no dashboards yet.</p>
        )}
        {!!dashboards?.length && (
          <div className='your-dashboards-wrapper'>
            {dashboards.map((d, index) => {
              return (
                <Link
                  key={'dash-link-' + index}
                  href={'/dashboards/' + d.id}
                  className='dashboard-container m-4 flex w-full cursor-pointer overflow-hidden border-solid border-orange-950 bg-orange-400 p-2 font-semibold hover:bg-orange-500'
                >
                  {d.title}
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default UserDashboardsWrapper;

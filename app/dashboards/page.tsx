import { getDashboards } from '../lib/db/dashboards/dashboard';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserDashboardsWrapper from './UserDashboardsWrapper';

interface DashPageProps {
  searchParams: { search: string };
}

const Dashboards = async ({ searchParams }: DashPageProps) => {
  const dashboards = await getDashboards({});
  return (
    <div className='mx-4 flex h-full flex-col'>
      <Card className='my-6 h-auto w-auto border px-6'>
        <CardHeader>
          <CardTitle className='text-2xl font-normal'>Dashboards</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboards.response && (
            <div className='all-dashboards flex max-h-[70%] w-[70%] flex-col gap-4'>
              {dashboards.response.map((d, index) => (
                <Link
                  key={'dash-link-' + d.id + '-' + d.title}
                  href={'/dashboards/' + d.id}
                  className='dashboard-link flex w-full cursor-pointer overflow-hidden border border-gray-500 p-2 font-semibold hover:bg-orange-500'
                >
                  {d.title}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
        <UserDashboardsWrapper />
      </Card>
    </div>
  );
};

export default Dashboards;

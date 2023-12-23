import AllDashboardsWrapper from './AllDashboardsWrapper';
import { getDashboards } from '../lib/db/dashboards/dashboard';
import Link from 'next/link';

interface DashPageProps {
  searchParams: { search: string };
}

const Dashboards = async ({ searchParams }: DashPageProps) => {
  const dashboards = await getDashboards({});
  return (
    <div className='dashboards w-full'>
      <h1>Dashboards : </h1>
      <div className='highlights-container flex items-center justify-center'>
        <div className=' max-w-[75%] rounded-lg bg-gray-500 p-4 shadow-md'>
          <h2 className='mb-3 text-xl font-semibold'>Highlights:</h2>
          <div className='scrollbar-thin grid auto-cols-[minmax(160px,1fr)] grid-flow-col grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 overflow-x-auto pt-4 '>
            {dashboards.map((d, index) => (
              <Link
                href={'/dashboards/' + d.title}
                className='dash-element flex cursor-pointer flex-col items-center justify-between rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-lg'
                key={'dash-elem' + index}
              >
                <h2 className='mb-4 overflow-hidden text-lg font-medium'>
                  {d.title}
                </h2>
                <img
                  src='/temp-dash-thumbnail.png'
                  alt={d.title + ' thumbnail'}
                  className='h-auto w-full rounded'
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <AllDashboardsWrapper
        dashboards={dashboards.filter((d) =>
          !searchParams.search
            ? true
            : d.title.toLowerCase().startsWith(searchParams.search)
        )}
      />
    </div>
  );
};

export default Dashboards;

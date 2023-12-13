import DraggablesWrapper from '@/app/components/dashboards/DraggablesWrapper';
import React from 'react';

// export async function generateStaticParams() {
// const dashboards = await fetch('https://.../dashboards').then((res) =>
//   res.json()
// );
//   return [
//     {
//       title: 'dummy',
//     },
//   ];
// }

type DashboardProps = {
  params: { title: string };
};

const dashboard = ({ params }: DashboardProps) => {
  // TODO good idea : seems like dune has max-width:1000px sets the width to 100% -- check a dune dashboard
  return (
    <div className='h-full min-h-[100vh] w-full border-2 border-solid border-red-900 p-4'>
      <header> {params.title} </header>
      <div className='draggables-wrapper relative'>
        <DraggablesWrapper />
      </div>
    </div>
  );
};

export default dashboard;

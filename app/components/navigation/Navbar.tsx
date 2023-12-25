'use server';

import Link from 'next/link';
import NavbarLinks from './NavbarLinks';

const Navbar = () => {
  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <Link
          href='/'
          className='btn btn-ghost text-3xl md:text-2xl xl:text-3xl'
        >
          Stacks Metrics
        </Link>
        <NavbarLinks />
      </div>
    </div>
  );
};

export default Navbar;

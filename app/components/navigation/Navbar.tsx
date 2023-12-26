'use server';

import Link from 'next/link';
import NavbarLinks from './NavbarLinks';

const Navbar = () => {
  return (
    <div className='navbar flex-1'>
      <Link href='/' className='btn btn-ghost text-xl md:text-xl xl:text-xl'>
        Stacks Metrics
      </Link>
      <NavbarLinks />
    </div>
  );
};

export default Navbar;

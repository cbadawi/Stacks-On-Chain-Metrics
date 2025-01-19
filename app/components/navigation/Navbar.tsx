'use server';

import Link from 'next/link';
import NavbarLinks from './NavbarLinks';
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
  return (
    <div className='navbar flex-1'>
      <Link href='/' className='btn btn-ghost text-xl md:text-xl xl:text-xl'>
        Stacks Metrics
      </Link>
      <NavbarLinks />
      {/* <ConnectWallet /> */}
    </div>
  );
};

export default Navbar;

'use server';

import Link from 'next/link';
import NavbarLinks from './NavbarLinks';
import ConnectWallet from './ConnectWallet';
import ThemeToggle from './ThemeToggle';
import { Card } from '@/components/ui/card';

const Navbar = () => {
  return (
    <Card className='navbar flex-1 rounded-none'>
      <div className='m-4'>
        <div className='flex w-full items-center justify-between'>
          <Link
            href='/'
            className='text-xl hover:border-gray-500 hover:text-orange-400 md:text-xl xl:text-2xl xl:font-bold'
          >
            Stacks Metrics
          </Link>
          <div className='mr-10 flex items-center gap-4'>
            <NavbarLinks />
            <ThemeToggle />
            {/* <ConnectWallet /> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;

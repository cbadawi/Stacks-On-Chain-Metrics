'use server';

import Link from 'next/link';
import NavbarLinks from './NavbarLinks';
import ThemeToggle from './ThemeToggle';
import { Card } from '@/components/ui/card';
import ConnectWallet from '../wallet/ConnectButton';
import Image from 'next/image';

const Navbar = () => {
  return (
    <Card className='navbar flex-1 rounded-none'>
      <div className='m-4'>
        <div className='flex w-full items-center justify-between'>
          <Link
            href='/'
            className='text-xl hover:border-gray-500 hover:text-orange-400 md:text-xl xl:text-2xl xl:font-bold'
          >
            <div className='flex items-center'>
              <Image
                src='/favicon.ico'
                alt='Stacks Metrics Logo'
                width={56}
                height={56}
              />
              <div>
                Stacks Metrics
                <span className='text-xs'> beta</span>
              </div>
            </div>
          </Link>
          <div className='flex items-end gap-4'>
            <NavbarLinks />
            <ThemeToggle />
            <ConnectWallet />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;

'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import AuthButton from './AuthButton';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const NavbarLinks = () => {
  const [navbarMenu, setNavbarMenu] = useState(false);
  const { data: session, status } = useSession();

  const handleNavbarMenu = () => {
    setNavbarMenu(!navbarMenu);
  };

  const links = [
    <Link href='/dashboards'>Dashboards</Link>,
    <Link href='/query'>Query</Link>,
    <Link href='/'>API Docs</Link>,
    <Link href='/pricing'>Upgrade</Link>,
  ];

  const pathname = usePathname().split('/')[1];

  return (
    <div className='nav-buttons-wrapper flex w-full justify-between'>
      <div className='hidden md:flex'>
        {links.map((link, index) => {
          const textShadow =
            link.props.href == '/' + pathname
              ? '0 0 10px #f9f9f9, 0 0 6px #ffa366'
              : '';
          return (
            <div
              key={'bar-' + index}
              className='btn btn-square btn-ghost w-24 text-sm font-thin text-white'
              style={{ textShadow }}
            >
              {link}
            </div>
          );
        })}
      </div>
      <div className='ml-auto hidden md:flex'>
        <AuthButton />
      </div>
      <div
        className='btn btn-square btn-ghost ml-auto flex md:hidden'
        onClick={handleNavbarMenu}
      >
        {navbarMenu ? (
          <AiOutlineClose size={30} />
        ) : (
          <AiOutlineMenu size={30} />
        )}
      </div>
      <div
        className={
          // top-[-100%] is the only difference. Handles the opening & closing
          navbarMenu
            ? 'absolute bottom-0 left-0 right-0 top-[4rem] z-50 flex h-screen w-full items-center justify-center bg-slate-800 text-center text-white duration-300 ease-in md:hidden'
            : 'absolute left-0 right-0 top-[-100%] z-50 flex h-screen w-full items-center justify-center bg-slate-800 text-center text-white duration-300 ease-in md:hidden'
        }
      >
        <div className='w-full'>
          <ul className='text-2xl font-bold uppercase'>
            {links.map((link, index) => (
              <li
                key={'menu-' + index}
                onClick={handleNavbarMenu}
                className='cursor-pointer py-5 hover:text-[#747FFF]'
              >
                {link}
              </li>
            ))}
            <li
              onClick={handleNavbarMenu}
              className='cursor-pointer py-5 hover:text-[#747FFF]'
            >
              <AuthButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavbarLinks;

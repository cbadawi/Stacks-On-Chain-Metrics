'use client';
// TODO move the links to their own client component that will use navbarMenu state
//  and leave the navbar on the server

import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthButton from './AuthButton';

const Navbar = () => {
  const [navbarMenu, setNavbarMenu] = useState(false);
  const { data: session, status } = useSession();

  const handleNavbarMenu = () => {
    setNavbarMenu(!navbarMenu);
  };

  const links = [
    <Link href='/insights'>Insights</Link>,
    <Link href='/query'>Query</Link>,
    <Link href='/'>API Docs</Link>,
    <Link href='/pricing'>Upgrade</Link>,
  ];

  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <Link
          href='/'
          className='btn btn-ghost text-3xl md:text-2xl xl:text-3xl'
        >
          Stacks Metrics
        </Link>
        <div className='ml-10 hidden md:flex'>
          {links.map((link, index) => (
            <div
              key={'bar-' + index}
              className='btn btn-square btn-ghost w-24 text-lg font-thin text-white hover:underline'
            >
              {link}
            </div>
          ))}
        </div>
      </div>
      <div className='hidden md:flex'>
        <AuthButton />
      </div>
      <div
        className='btn btn-square btn-ghost flex md:hidden'
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

export default Navbar;

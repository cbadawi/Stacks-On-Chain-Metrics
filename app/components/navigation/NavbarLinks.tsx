'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const NavbarLinks = () => {
  const [navbarMenu, setNavbarMenu] = useState(false);

  const handleNavbarMenu = () => {
    setNavbarMenu(!navbarMenu);
  };

  const pathname = usePathname();
  const links = [
    { href: '/query', label: 'Query' },
    { href: '/dashboards', label: 'Dashboards' },
    { href: '/docs', label: 'Documentation' },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map((link) => {
          const isActive = pathname.split('/')[1] === link.href.split('/')[1];
          const textShadow = isActive
            ? '0 0 15px #f9f9f9, 0 0 6px #ffa366'
            : '';

          const isDisabled = link.href === '/docs';
          return (
            <NavigationMenuItem key={link.href} className='cursor-not-allowed'>
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'text-l border-2 border-transparent px-4 py-1 transition-all duration-300 ease-in-out hover:rounded-xl hover:border-gray-300 hover:bg-[#15161f] hover:text-orange-500',
                    isDisabled ? 'pointer-events-none opacity-50' : ''
                  )}
                  style={{
                    textShadow,
                  }}
                >
                  {link.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>

    // <div className='nav-buttons-wrapper flex w-full justify-between'>
    //   <div className='hidden md:flex'>
    //     {links.map((link, index) => {
    //       const textShadow =
    //         link.props.href == '/' + pathname
    //           ? '0 0 10px #f9f9f9, 0 0 6px #ffa366'
    //           : '';
    //       return (
    //         <div
    //           key={'bar-' + index}
    //           className='btn btn-square btn-ghost w-24 text-sm font-thin text-white'
    //           style={{ textShadow }}
    //         >
    //           {link}
    //         </div>
    //       );
    //     })}
    //   </div>
    //   <div className='ml-auto hidden md:flex'></div>
    //   <div
    //     className='btn btn-square btn-ghost ml-auto flex md:hidden'
    //     onClick={handleNavbarMenu}
    //   >
    //     {navbarMenu ? (
    //       <AiOutlineClose size={30} />
    //     ) : (
    //       <AiOutlineMenu size={30} />
    //     )}
    //   </div>
    //   <div
    //     className={
    //       // top-[-100%] is the only difference. Handles the opening & closing
    //       navbarMenu
    //         ? 'absolute bottom-0 left-0 right-0 top-[4rem] z-50 flex h-screen w-full items-center justify-center bg-slate-800 text-center text-white duration-300 ease-in md:hidden'
    //         : 'absolute left-0 right-0 top-[-100%] z-50 flex h-screen w-full items-center justify-center bg-slate-800 text-center text-white duration-300 ease-in md:hidden'
    //     }
    //   >
    //     <div className='w-full'>
    //       <ul className='text-2xl font-bold uppercase'>
    //         {links.map((link, index) => (
    //           <li
    //             key={'menu-' + index}
    //             onClick={handleNavbarMenu}
    //             className='cursor-pointer py-5 hover:text-[#747FFF]'
    //           >
    //             {link}
    //           </li>
    //         ))}
    //         <li
    //           onClick={handleNavbarMenu}
    //           className='cursor-pointer py-5 hover:text-[#747FFF]'
    //         >
    //           wallet connect
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </div>
  );
};

export default NavbarLinks;

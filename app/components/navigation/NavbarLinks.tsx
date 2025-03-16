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
import { Menu, X } from 'lucide-react';

const NavbarLinks = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/query', label: 'Query' },
    { href: '/dashboards', label: 'Dashboards' },
    { href: '/docs', label: 'Docs ( Soon 🚧)' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className='hidden md:block'>
        <NavigationMenu>
          <NavigationMenuList>
            {links.map((link) => {
              const isActive =
                pathname.split('/')[1] === link.href.split('/')[1];
              const textShadow = isActive
                ? '0 0 15px #f9f9f9, 0 0 6px #ffa366'
                : '';
              const isDisabled = link.href === '/docs';

              return (
                <NavigationMenuItem
                  key={link.href}
                  className='cursor-not-allowed'
                >
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'text-l border-2 border-transparent px-4 py-1 transition-all duration-300 ease-in-out hover:rounded-xl hover:border-gray-300 hover:bg-[#15161f] hover:text-orange-500',
                        isDisabled ? 'pointer-events-none opacity-50' : ''
                      )}
                      style={{ textShadow }}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Hamburger Button - Visible on mobile */}
      <button
        className='rounded-lg p-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 md:hidden'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label='Toggle menu'
      >
        {isMenuOpen ? (
          <X className='h-6 w-6 text-white' />
        ) : (
          <Menu className='h-6 w-6 text-white' />
        )}
      </button>

      {/* Mobile Menu - Slide down animation */}
      <div
        className={cn(
          'absolute right-0 top-16 w-full border-b border-gray-800 bg-[#15161f] shadow-lg md:hidden',
          'overflow-hidden transition-all duration-300 ease-out',
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className='flex flex-col space-y-4 p-4'>
          {links.map((link) => {
            const isActive = pathname.split('/')[1] === link.href.split('/')[1];
            const textShadow = isActive
              ? '0 0 15px #f9f9f9, 0 0 6px #ffa366'
              : '';
            const isDisabled = link.href === '/docs';

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'rounded-md px-4 py-2 text-white transition-colors',
                  'hover:bg-gray-800 hover:text-orange-500',
                  isActive && 'font-medium text-orange-400',
                  isDisabled && 'pointer-events-none opacity-50'
                )}
                style={{ textShadow }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NavbarLinks;

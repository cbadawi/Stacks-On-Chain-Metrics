'use client';

import React from 'react';
import { Github, HeartPulse, EllipsisVertical, GithubIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Options = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='secondary'
          className='fixed bottom-2 right-2 z-50 m-5 h-16 w-16 p-2'
        >
          <EllipsisVertical className='h-full w-full' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Stacks on chain</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              window.open('https://github.com/cbadawi/stacksmetrics/issues/new')
            }
          >
            Report an issue
            <DropdownMenuShortcut>
              <GithubIcon size={25} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Health check
            <DropdownMenuShortcut>
              <HeartPulse color='red' size={25} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Options;

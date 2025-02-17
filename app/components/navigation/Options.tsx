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
import { APP_NAME } from '@/app/appDetails';

const Options = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='fixed bottom-2 right-2 z-50 m-3 h-10 w-10 bg-slate-800 p-2 opacity-75 hover:bg-slate-800 hover:opacity-100'
        >
          <EllipsisVertical className='h-full w-full' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>{APP_NAME}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              window.open('https://github.com/cbadawi/stacksmetrics/issues/new')
            }
          >
            Feedback
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

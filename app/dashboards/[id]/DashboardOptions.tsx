'use client';

import React from 'react';
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
import { useEditMode } from './EditModeContext';
import { EllipsisVertical } from 'lucide-react';

const DashboardOptions = () => {
  const { editMode, setEditMode } = useEditMode();

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' className='hover:bg-orange-300' size={'lg'}>
          <EllipsisVertical size={'50px'} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Button
              variant='ghost'
              className='h-full w-full'
              onClick={handleToggleEditMode}
            >
              {/* use locks svg instead */}
              {editMode ? 'Disable Editing' : 'Enable Editing'}
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant='ghost' className='h-full w-full'>
              Change Title
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant='ghost' className='h-full w-full' disabled={true}>
              Private
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant='destructive' className='h-full w-full'>
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardOptions;

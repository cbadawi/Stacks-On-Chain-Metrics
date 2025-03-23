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
import { useEditMode } from '../../contexts/EditModeContext';
import { EllipsisVertical } from 'lucide-react';
import { useUser } from '@/app/contexts/UserProvider';
import { deleteDashboard } from '@/app/lib/db/dashboards/dashboard';
import { redirect } from 'next/navigation';

const DashboardOptions = ({ owner, id }: { id: number; owner: string }) => {
  const { editMode, setEditMode } = useEditMode();
  const { userData } = useUser();

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  if (owner !== userData?.profile.stxAddress.mainnet) return;
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
              {/* todo use locks svg instead */}
              {editMode ? 'Save Editing' : 'Enable Editing'}
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
            <Button
              variant='destructive'
              className='h-full w-full'
              onClick={async () => {
                await deleteDashboard({ id });
                redirect('/dashboards');
              }}
            >
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardOptions;

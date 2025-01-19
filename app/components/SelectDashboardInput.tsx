'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ControllerRenderProps } from 'react-hook-form';
// import { useUser } from '../contexts/UserProvider';
import { useEffect, useState } from 'react';
import { getDashboards } from '../lib/db/dashboards/dashboard';
import { Dashboard } from '@prisma/client';

export function SelectDashboardInput({
  field,
}: {
  field: ControllerRenderProps<
    {
      dashboardTitle: string;
      chartTitle: string;
      privateDashboard?: boolean | undefined;
      password?: string | undefined;
    },
    'dashboardTitle'
  >;
}) {
  const [open, setOpen] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  // const { userSession, userData } = useUser();
  // console.log('!!!! auth', { userSession, userData });
  useEffect(() => {
    const fetchDashboards = async () => {
      const dashboards = await getDashboards({
        address: '',
      });
      setDashboards(dashboards);
    };
    fetchDashboards();
  }, []); // userSession

  field.value = field.value ?? '';

  const filteredDashboards = dashboards.filter((dash) =>
    field.value ? dash.title.includes(field.value) : dash
  );

  console.log({ dashboards });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className='flex w-64 flex-col'>
        <PopoverTrigger asChild>
          <Input
            placeholder='Title'
            autoComplete='off'
            type='text'
            {...field}
            onFocus={() => {
              setOpen(true);
            }}
            onBlur={(e) => {
              setTimeout(() => {
                if (!e?.currentTarget?.contains(e.relatedTarget)) {
                  setOpen(false);
                }
              }, 200);
            }}
          />
        </PopoverTrigger>
        {open && (
          <Command className='absolute z-50 mt-8 h-auto max-h-[7.25rem] w-64 overflow-scroll'>
            <CommandList>
              {filteredDashboards.length === 0 ? (
                <CommandEmpty className='flex flex-col pl-3 font-thin'>
                  <span>No dashboard found.</span>
                  <span>Creating a new one....</span>
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredDashboards.map((dash) => (
                    <CommandItem
                      className='cursor-pointer'
                      key={dash.id}
                      value={dash.title}
                      onSelect={(currentValue) => {
                        field.onChange(currentValue);
                        setOpen(false);
                      }}
                    >
                      {dash.title}
                      <Check
                        className={cn(
                          'ml-auto',
                          field.value === dash.title
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        )}
      </div>
    </Popover>
  );
}

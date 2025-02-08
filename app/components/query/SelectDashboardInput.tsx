import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { ControllerRenderProps } from 'react-hook-form';
import { useState } from 'react';
import { Dashboard } from '@prisma/client';

export function SelectDashboardInput({
  field,
  filteredDashboards,
}: {
  filteredDashboards: Dashboard[];
  field: ControllerRenderProps<
    {
      dashboardTitle: string;
      chartTitle: string;
      privateDashboard?: boolean;
      password?: string;
    },
    'dashboardTitle'
  >;
}) {
  const [open, setOpen] = useState(false);
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
          <Command className='absolute z-50 mt-8 h-auto max-h-[7.25rem] w-64 overflow-scroll border'>
            <CommandList>
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
                        field.value === dash.title ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </div>
    </Popover>
  );
}

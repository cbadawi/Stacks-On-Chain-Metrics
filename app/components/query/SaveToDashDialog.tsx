import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Chart, Dashboard } from '@prisma/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { ChartType, VariableType } from '../helpers';

import { SelectDashboardInput } from './SelectDashboardInput';
import { Button } from '@/components/ui/button';
import { getDashboards } from '@/app/lib/db/dashboards/dashboard';
import { addChartToDashboard } from '@/app/query/actions';
import { useUser } from '@/app/contexts/UserProvider';

export const SaveToDashDialog = ({
  query,
  variableDefaults,
  chartType,
}: {
  chartType: ChartType;
  variableDefaults: VariableType;
  query: string;
}) => {
  const [submitText, setSubmitText] = useState<
    'Add chart' | 'Create a new dashboard'
  >('Create a new dashboard');
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const { userData } = useUser();

  useEffect(() => {
    const fetchDashboards = async () => {
      const dashboardsResp = await getDashboards({ address: '' });
      if (dashboardsResp.response) setDashboards(dashboardsResp.response);
    };
    fetchDashboards();
  }, []);

  async function onSubmit(values: z.infer<typeof saveToDashboardSchema>) {
    try {
      const addChartResponse = await addChartToDashboard({
        dashboardTitle: values.dashboardTitle,
        chartTitle: values.chartTitle,
        userAddress: userData?.profile.stxAddress.mainnet,
        chartType,
        privateDashboard: values.privateDashboard,
        dashboardPassword: values.password,
        query,
        variables: variableDefaults,
      });
      if (!addChartResponse.success) {
        toast.error('Failed to add chart', {
          description: 'yadda' + addChartResponse.message,
        });
      } else if ('dashboard' in addChartResponse) {
        toast('Chart has been added', {
          description: values.chartTitle,
          action: {
            label: 'Go to dashboard ' + values.dashboardTitle,
            onClick: () =>
              window.open(
                `/dashboards/${addChartResponse.dashboard.id}`,
                '_blank'
              ),
          },
        });
      }
      form.reset();
    } catch (error) {
      console.error('Form submission error', error);
      toast(<p>Failed to submit the form. Please try again.</p>);
    }
  }

  const saveToDashboardSchema = z
    .object({
      dashboardTitle: z.string().min(2, {
        message: 'Dashboard title must be at least 2 characters.',
      }),
      chartTitle: z.string().min(2, {
        message: 'Chart title must be at least 2 characters.',
      }),
      privateDashboard: z.boolean().default(true).optional(),
      password: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.privateDashboard &&
        (!data.password || data.password.length < 6)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['password'],
          message: 'Password must be at least 6 characters.',
        });
      }
    });

  const form = useForm<z.infer<typeof saveToDashboardSchema>>({
    resolver: zodResolver(saveToDashboardSchema),
    mode: 'onChange', // Validate on each change
  });

  const { isValid } = form.formState;

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Save Chart</DialogTitle>
        <DialogDescription>
          Save to an existing dashboard or create a new one
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid gap-4 py-4'
        >
          <FormField
            control={form.control}
            name='dashboardTitle'
            render={({ field }) => {
              const filteredDashboards = dashboards.filter((dash) =>
                field.value ? dash.title.includes(field.value) : true
              );
              if (
                !field.value ||
                !filteredDashboards.map((f) => f.title).includes(field.value)
              )
                setSubmitText('Create a new dashboard');
              else setSubmitText('Add chart');
              return (
                <FormItem>
                  <div className='flex items-center gap-4'>
                    <FormLabel className='w-24'>Dashboard</FormLabel>
                    <FormControl>
                      <SelectDashboardInput
                        filteredDashboards={filteredDashboards}
                        field={field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name='chartTitle'
            render={({ field }) => {
              field.value = field.value ?? '';
              return (
                <FormItem>
                  <div className='flex items-center gap-4'>
                    <FormLabel className='w-24'>Chart</FormLabel>
                    <FormControl className='w-64'>
                      <Input
                        autoComplete='off'
                        placeholder='Title'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name='privateDashboard'
            render={({ field }) => (
              <FormItem>
                <div className='flex h-12 items-center gap-4'>
                  <FormControl>
                    <Checkbox
                      disabled={true}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Private</FormLabel>

                  {!!field.value && (
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl className='ml-4 w-64'>
                            <Input
                              placeholder='Password'
                              type='text'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </FormItem>
            )}
          />
          <DialogClose asChild>
            <Button type='submit' disabled={!isValid}>
              {submitText}
            </Button>
          </DialogClose>
        </form>
      </Form>
    </DialogContent>
  );
};

'use server';

import {
  DashboardWithCharts,
  getDashboard,
} from '@/app/lib/db/dashboards/dashboard';
import { fetchData } from '@/app/lib/fetch';

export async function fetchDashboardData(formData: FormData) {
  const title = formData.get('title')?.toString();
  if (!title) return null;
  const dashboard = (await getDashboard(title, true)) as DashboardWithCharts;
  if (!dashboard) return null;

  const promises = dashboard.charts.map((chart) => fetchData(chart.query));
  const data = await Promise.all(promises);

  const chartsWithData = dashboard.charts.map((chart, index) => ({
    ...chart,
    data: data[index],
  }));

  return { ...dashboard, charts: chartsWithData };
}

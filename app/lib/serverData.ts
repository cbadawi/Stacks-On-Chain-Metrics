import {
  ChartType,
  CustomizableChartOptions,
  LeftRight,
  getYColNamesFromData,
} from '../components/charts/helpers';
import { stacksData2Array } from '../helpers/delet';

export const fetchData = async (query: string) => {
  console.log('running queyr', query);
  const response = await fetch('https://api.stacksdata.info/v1/sql', {
    method: 'POST',
    next: { revalidate: 90 },
    headers: {
      'Content-Type': 'application/json',
    },
    body: query,
  });
  const json = await response.json();
  return json;
};

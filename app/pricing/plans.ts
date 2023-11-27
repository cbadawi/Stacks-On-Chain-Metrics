import { IPlans } from './IPlans';

// TODO use stripe library to fetch products instead of hardcoding them
export const plans: IPlans = {
  charts: [
    {
      name: 'Free',
      price: '0',
      perks: [
        'Hopes & prayers',
        'Dedicated Support',
        'Slower queries with low priority execution',
      ],
    },
    {
      name: 'Silver',
      price: '10',
      perks: [
        'Faster queries & high priority execution',
        '100 rows of csv downloads per billing cycle',
      ],
    },
    {
      name: 'Gold',
      price: '25',
      perks: [
        '1000 rows of csv downloads per billing cycle',
        'No watermarks on charts',
      ],
    },
    {
      name: 'Digital Gold',
      price: '45',
      perks: [
        'Unlimited csv downloads',
        'Ability to create, insert and read custom tables',
        'Alerts (Soon)',
        'Private Dashboards (Soon)',
        'All previously mentioned benefits',
      ],
    },
  ],
  api: [
    {
      name: 'Free',
      price: '0',
      perks: [
        'Basic access to the Stacks Node API',
        'Slower API requests with low priority execution',
        '30 RPM per client IP for unauthenticated traffic (without an API key)',
      ],
    },
    {
      name: 'Developer',
      price: '35',
      perks: [
        'Faster API requests & priority execution',
        'Ability to query the blockchain using SQL with the /query API route',
        '1000 RPM per API key',
        'All previously mentioned benefits',
      ],
    },
    {
      name: 'Entreprise',
      price: 'Custom pricing',
      perks: [
        'Unlimited api requests',
        'Ability to create, insert and read custom tables',
        'All previously mentioned benefits',
      ],
    },
  ],
};

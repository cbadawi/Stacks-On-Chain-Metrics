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
        'Limited up to 300 rows returned per query',
        'Slower queries with very low priority execution',
      ],
    },
    {
      name: 'Silver',
      price: '10',
      perks: [
        'Faster queries & high priority execution',
        'Up to 1000 rows returned per query',
        '100 rows of csv downloads per billing cycle',
        'Full access to alpha insights dashboards', // for ex: blur our lower timeframes and add tooltip to upgrade plans
        'No watermarks on charts',
      ],
    },
    {
      name: 'Gold',
      price: '25',
      // TODO maybe add 1 alert here
      perks: [
        'Unlimited rows of csv downloads',
        'Unlimited & Paginated query results',
        'All previously mentioned benefits',
      ],
    },
    {
      name: 'Digital Gold',
      price: '35',
      perks: [
        'Ability to create, insert and read custom tables',
        'Alerts (Soon)',
        `Create Private Dashboards. Don't share private data (Soon)`,
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

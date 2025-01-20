'use server';

import { NextResponse } from 'next/server';

export async function fetchData(query: string) {
  'use server';

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    data: [
      // { month: 'January 1', value: 100, amount: 186 },
      // { month: 'February 1', value: 100, amount: 305 },
      // { month: 'March 1', value: 100, amount: 237 },
      // { month: 'April 1', value: 100, amount: 73 },
      // { month: 'May 1', value: 100, amount: 209 },
      // { month: 'June 1', value: 100, amount: 214 },
      // { month: 'January 2', value: 100, amount: 186 },
      // { month: 'February 2', value: 100, amount: 305 },
      // { month: 'March 2', value: 100, amount: 237 },
      // { month: 'April 2', value: 100, amount: 73 },
      // { month: 'May 2', value: 100, amount: 209 },
      // { month: 'June 2', value: 100, amount: 214 },
      // { month: 'January 3', value: 100, amount: 186 },
      // { month: 'February 3', value: 100, amount: 305 },
      { month: 'March 3', value: 100, amount: 237 },
      { month: 'April 3', value: 100, amount: 73 },
      { month: 'May 3', value: 100, amount: 209 },
      { month: 'June 3', value: 100, amount: 214 },
      { month: 'January 3', value: 100, amount: 186 },
      { month: 'February 3', value: 100, amount: 305 },
      { month: 'March 3', value: 100, amount: 237 },
      { month: 'April 3', value: 100, amount: 73 },
      { month: 'May 3', value: 100, amount: 209 },
      { month: 'June 3', value: 100, amount: 214 },
      { month: 'January 4', value: 100, amount: 186 },
      { month: 'February 4', value: 100, amount: 305 },
      { month: 'March 4', value: 100, amount: 237 },
      { month: 'April 4', value: 100, amount: 73 },
      { month: 'May 4', value: 100, amount: 209 },
      { month: 'June 4', value: 100, amount: 214 },
      { month: 'January 5', value: 100, amount: 186 },
      { month: 'February 5', value: 100, amount: 305 },
      { month: 'March 5', value: 100, amount: 237 },
      { month: 'April 5', value: 100, amount: 73 },
      { month: 'May 5', value: 100, amount: 209 },
      { month: 'June 5', value: 100, amount: 214 },
    ],
  };
}

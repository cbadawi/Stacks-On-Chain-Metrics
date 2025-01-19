import { NextResponse } from 'next/server';

// todo
// add limit 300
// extra postgres configs to the client
export async function POST() {
  console.log('sending data');
  return NextResponse.json({
    success: true,
    message: null, // for db errors
    data: [
      { day: 1, amount: 333 },
      { day: 2, amount: 444 },
      { day: 3, amount: 222 },
    ],
  });
}

// import { fetchData, generateQuery } from '@/app/lib/ai/query';
// import { stacksPool } from '@/app/lib/db/client';
// import { log } from '@/app/lib/logger';
// import { replaceVariables } from '@/app/lib/variables';
// import { NextRequest, NextResponse } from 'next/server';

// const errorResponse = (message: string, status: number = 500) => {
//   return NextResponse.json(
//     {
//       success: false,
//       error: {
//         message,
//         code: 'ERROR',
//       },
//     },
//     { status }
//   );
// };
// interface QueryRequest {
//   query?: string;
//   prompt?: string;
// }

// // either query or body need to be present
// const queryValidation = (body: any): body is QueryRequest => {
//   console.log({ body });
//   if (!body) return false;
//   console.log({ query: body.query, prompt: body.prompt });
//   if (!body.query && !body.prompt) return false;

//   return true;
// };

// export type Result = Record<string, string | number>;

// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   if (!queryValidation(body)) {
//     return errorResponse('Invalid request body');
//   }
//   const { query, prompt } = body;
//   log.info('query post : ', { query, prompt });
//   let sql = query;

//   try {
//     if (prompt) {
//       const aiQueryResult = await generateQuery(prompt, query);
//       sql = aiQueryResult.query;
//     }
//     if (!sql) return errorResponse('No query found');

//     const data = await fetchData(sql);

//     const response = NextResponse.json(data, {
//       status: 200,
//     });
//     return response;
//   } catch (error) {
//     if (error instanceof Error) {
//       return errorResponse(error.message, 400);
//     }
//     return errorResponse('Internal server error', 500);
//   }
// }

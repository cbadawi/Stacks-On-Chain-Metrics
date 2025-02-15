import { stacksPool } from '@/app/lib/db/client';
import { NextRequest, NextResponse } from 'next/server';

const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: 'ERROR',
      },
    },
    { status }
  );
};
interface QueryRequest {
  query?: string;
  prompt?: string;
}

// either query or body need to be present
const queryValidation = (body: any): body is QueryRequest => {
  if (!body) return false;

  if (!body.query && !body.prompt) return false;

  return true;
};

export type Result = Record<string, string | number>;

export async function POST(request: NextRequest) {
  const body = request.body;
  if (!queryValidation(body)) {
    return errorResponse('Invalid request body');
  }

  const { query, prompt } = body;
  let result: Result[] = [];
  try {
    if (!prompt && query) {
      const response = await stacksPool.query(query);
      result = response.rows;
    } else if (prompt) {
      const promptAndQuery = `-- ${prompt}\n${query}`;
      stacksPool.query(prompt);
    } else return errorResponse('Invalid request body');

    return NextResponse.json(result, {
      status: result ? 200 : 400,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return errorResponse((err as Error).message);
  }
}

import { NODE_QUERY_API } from './constants';

export const isProd = process.env.NODE_ENV === 'production';

export const fetchData = async (
  query: string,
  errorHandler?: (message: string) => void,
  cookies?: string
) => {
  const body = JSON.stringify({
    query,
  });
  const url = NODE_QUERY_API + '/v1/query';
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (cookies) headers = { ...headers, Cookie: cookies };

  let response: Response | null = null;
  let jsonResponse: any;
  try {
    response = await fetch(url, {
      credentials: 'include',
      method: 'POST',
      next: { revalidate: isProd ? 90 : 0 },
      headers,
      body,
    });
    jsonResponse = await response.json();
  } catch (err) {
    if (err instanceof Error) {
      if (errorHandler) errorHandler(err.message);
      console.error(err.message);
    }
  }
  if (jsonResponse?.message) {
    if (errorHandler) errorHandler(jsonResponse?.message);
    console.error(jsonResponse?.message);
  }
  if (response) {
    if (!response?.ok) {
      return jsonResponse;
    }
  }
  return orderData(jsonResponse);
};

const orderData = (response: { data: any[]; order: string[] }) => {
  const data = response?.data?.map((row: any, index: number) => {
    const orderedRow: any = {};
    response.order.forEach((col: string) => (orderedRow[col] = row[col]));
    return orderedRow;
  });
  return data ?? [];
};

export const getCookie = (sessionToken?: string) =>
  sessionToken ? `session-token=${sessionToken}` : undefined;

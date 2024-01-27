import { NODE_QUERY_API } from './constants';

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
      next: { revalidate: 0 },
      headers,
      body,
    });
    jsonResponse = await response.json();
  } catch (err) {
    if (errorHandler) {
      if (jsonResponse?.message) {
        errorHandler(jsonResponse?.message);
      } else if (err instanceof Error) {
        errorHandler(err.message);
      }
    }
    if (jsonResponse?.message) console.error(jsonResponse?.message);
    else if (err instanceof Error) console.error(err.message);
    return null;
  }
  if (response) {
    if (!response?.ok) {
      return jsonResponse;
    }
  }
  return orderData(jsonResponse);
};

const orderData = (response: { data: any[]; order: string[] }) => {
  const data = response.data?.map((row: any, index: number) => {
    const orderedRow: any = {};
    response.order.forEach((col: string) => (orderedRow[col] = row[col]));
    return orderedRow;
  });
  return data;
};

export const getCookie = (sessionToken?: string) =>
  sessionToken ? `session-token=${sessionToken}` : undefined;

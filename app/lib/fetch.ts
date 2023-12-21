import { NODE_QUERY_API } from './constants';

export const fetchData = async (
  query: string,
  errorHandler?: (message: string) => void
) => {
  const body = JSON.stringify({
    query,
  });
  const url = NODE_QUERY_API + '/v1/query';

  const response = await fetch(url, {
    method: 'POST',
    next: { revalidate: 90 },
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  const json = await response.json();
  if (!response.ok && errorHandler) errorHandler(json.message);
  return json;
};

export const orderData = (response: { data: any[]; order: string[] }) => {
  const data = response.data?.map((row: any, index: number) => {
    const orderedRow: any = {};
    response.order.forEach((col: string) => (orderedRow[col] = row[col]));
    return orderedRow;
  });
  return data;
};

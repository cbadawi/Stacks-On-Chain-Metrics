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

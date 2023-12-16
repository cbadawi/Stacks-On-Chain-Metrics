export const fetchData = async (query: string) => {
  const response = await fetch('https://api.stacksdata.info/v1/sql', {
    method: 'POST',
    next: { revalidate: 90 },
    headers: {
      'Content-Type': 'application/json',
    },
    body: query,
  });
  const json = await response.json();
  return json;
};

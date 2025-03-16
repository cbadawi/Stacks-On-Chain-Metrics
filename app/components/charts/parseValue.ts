export const parseValue = (tableData: any): string => {
  if (typeof tableData === 'boolean') return JSON.stringify(tableData);
  if (!isNaN(Number(tableData))) return Number(tableData).toLocaleString();
  return (tableData || '').toString();
};

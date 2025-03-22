export function prettyAddress(address: string): string {
  if (address.length <= 6) {
    return address;
  }

  const prefix = address.slice(0, 3);
  const suffix = address.slice(-4);

  return `${prefix}..${suffix}`;
}

export function labelFormatter(label: any): string {
  const stringLabel = prettyValue(label);
  if (stringLabel.length <= 10) {
    return stringLabel;
  }

  const prefix = stringLabel.slice(0, 2);
  const suffix = stringLabel.slice(-2);

  return `${prefix}..${suffix}`;
}

export const prettyValue = (value: any) => {
  if (value === null || value === undefined) return 'NULL';
  if (`${value}`.startsWith('0x') || `${value}`.startsWith('\\x')) return value;
  if (typeof value === 'boolean') return JSON.stringify(value);
  if (value instanceof Date) return value.toLocaleDateString();
  if (!isNaN(value)) return Number(value).toLocaleString();
  return (value || '').toString();
};

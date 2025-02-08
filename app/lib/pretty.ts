export function prettyAddress(address: string): string {
  if (address.length <= 6) {
    return address;
  }

  const prefix = address.slice(0, 3);
  const suffix = address.slice(-4);

  return `${prefix}..${suffix}`;
}

export function labelFormatter(label: any): string {
  const stringLabel = `${label}`;
  if (stringLabel.length <= 10) {
    return stringLabel;
  }

  const prefix = stringLabel.slice(0, 2);
  const suffix = stringLabel.slice(-2);

  return `${prefix}..${suffix}`;
}

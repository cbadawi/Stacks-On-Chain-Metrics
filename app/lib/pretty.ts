export function prettyAddress(address: string): string {
  if (address.length <= 6) {
    return address;
  }

  const prefix = address.slice(0, 3);
  const suffix = address.slice(-4);

  return `${prefix}..${suffix}`;
}

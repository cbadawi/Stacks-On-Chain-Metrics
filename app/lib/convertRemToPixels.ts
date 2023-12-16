export function convertRemToPixels(rem: number) {
  const ratio =
    typeof window == 'undefined'
      ? 16
      : parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * ratio;
}

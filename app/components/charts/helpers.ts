import { scaleTime, scaleLinear } from '@visx/scale';

export type Scales = typeof scaleLinear | typeof scaleTime;

/**
 * Checks if the value should be plotted as an int
 */
export const isNum = (value: any) => !isNaN(value) && !(value instanceof Date);
/**
 * Checks if the value should be plotted as date
 */
export const isDate = (value: any) => new Date(value) instanceof Date;

export const parseValue = (value: any) => {
  if (isNum(value)) return value;
  else if (isDate(value)) return new Date(value);
  else return value;
};

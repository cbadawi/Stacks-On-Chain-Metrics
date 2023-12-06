import { max, min, extent } from '@visx/vendor/d3-array';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import { useMemo } from 'react';

// Types
export type Scales = typeof scaleLinear | typeof scaleTime | typeof scaleBand;

export type MarginObject = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const customizableChartOptions = ['bar', 'line'];

export type CustomizableChartOptions = Exclude<
  ChartType,
  [ChartType.table, ChartType.pie, ChartType.treemap, ChartType.number]
>;

export enum ChartType {
  'table',
  'line',
  'bar',
  'pie',
  'treemap',
  'number',
}

// Functions

export const getBarAndLineColNames = (
  customizableColumnTypes: CustomizableChartOptions[],
  yNames: string[]
) => {
  let barYNames: string[] = [];
  let lineYNames: string[] = [];
  customizableColumnTypes?.map((type, index) => {
    if (type == ChartType.bar) barYNames.push(yNames[index]);
    if (type == ChartType.line) lineYNames.push(yNames[index]);
  });

  return {
    barYNames,
    lineYNames,
  };
};

//  Type Checking
/**
 * Checks if the value should be plotted as an int
 */
export const isNum = (value: any) => !isNaN(value) && !(value instanceof Date);
/**
 * Checks if the value should be plotted as date
 */
// @ts-ignore
export const isDate = (value: any) => new Date(value) != 'Invalid Date';

// Parsing
export const parseValue = (value: any) => {
  if (isNum(value)) return value;
  else if (isDate(value)) return new Date(value);
  else return value;
};

export function formatAxisValue(value: any) {
  const point = JSON.stringify(value);
  if (point.length >= 20) return value.slice(0, 20) + '...';
  return value;
}

// Scales
export function getScaleCallback(
  data: any[],
  colName: string,
  axes: 'x' | 'y',
  chartType?: ChartType
) {
  if (chartType == ChartType.bar && axes == 'x') return scaleBand;
  const value = data[0][colName];
  if (isNum(value)) return scaleLinear;
  else if (isDate(value)) return scaleTime;
  // throw new Error(
  //   `Scale callback not defined for value ${value} in column ${colName}`
  // );
}

export function getXScale(
  data: any[],
  xName: string,
  xMax: number,
  scale: Scales,
  axis: 'x' | 'y',
  chartType?: ChartType
) {
  // TODO wrap scales in useMemo [xMax, data]
  if (chartType == ChartType.bar && axis == 'x')
    return scaleBand<string>({
      range: [0, xMax],
      round: true,
      domain: data.map((d) => d[xName]),
      padding: 0.2,
    });
  if (scale.name == 'createLinearScale')
    return scaleLinear<number>({
      range: [0, xMax],
      domain: [
        min(data, (d: any) => d[xName]) || 0,
        max(data, (d: any) => d[xName]) || 0,
      ],
      nice: true,
    });
  else if (scale.name == 'createTimeScale') {
    return scaleTime<number>({
      range: [0, xMax],
      domain: extent(data, (d: any) => new Date(d[xName])) as [Date, Date],
    });
  }
  // throw new Error(`X scale not defined for ${xName}`);
}

export function getYScale(
  data: any[],
  yNames: string[],
  yMax: number,
  scale: typeof scaleLinear | typeof scaleTime,
  chartType?: ChartType
) {
  // TODO wrap scale in useMemo [yMax, data]), these are probably high cost since its looping through all points several times
  // https://react.dev/reference/react/useMemo#caveats
  if (scale.name == 'createLinearScale') {
    // in case of bar chart, the bars will stack on top of each other
    // hence, we add(stack) all the y values before finding their max.
    const maxY =
      chartType == ChartType.bar
        ? Math.max(
            ...data.map((d) =>
              [...yNames.map((key) => Number(d[key]))].reduce(
                (acc, curr) => acc + curr
              )
            )
          )
        : Math.max(
            ...data.map((d) => Math.max(...yNames.map((key) => Number(d[key]))))
          );
    return scale<number>({
      range: [yMax, 0],
      domain: [0, maxY || 0],
      nice: true,
    });
  }
  // throw new Error(`Y scale not defined for ${yName}`);
}

export function getYAxesNamesFromData(data: any[]) {
  return data?.length ? Object.keys(data[0]).slice(1) : [];
}
// Colors
export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
export const colors = [
  '#634bde',
  '#0033ad',
  '#00ffbd',
  '#F7931A',
  'rgb(250,0,0)',
  'LightSalmon',
  'rgb(100,250,250)',
  'rgb(0,250,0)',
  'rgb(250,250,100)',
  'rgb(250,250,250)',
  'rgb(250,100,100)',
  'rgb(100,250,250)',
  'MediumSpringGreen',
  'blueviolet',
  'brown',
  'burlywood',
  'burlywood',
  'chartreuse',
  'cornflowerblue',
  'crimson',
  'cyan',
  'darkolivegreen',
  'deeppink',
  'hotpink',
  'lavender',
  'lemonchiffon',
  'mediumpurple',
  'olivedrab',
  'palevioletred',
  'peru',
  'peachpuff',
  'whitesmoke',
];

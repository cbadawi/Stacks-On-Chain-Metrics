import { ChartConfig } from '@/components/ui/chart';
import {
  Chart,
  ChartType,
  CustomizableChartTypes,
  LeftRight,
} from '@prisma/client';

export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.example.com'
    : 'http://localhost:8000';

console.log('NODE_ENV', process.env.NODE_ENV);

export const CHART_CONTAINER_WIDTH = 1100;
export const CHART_CONTAINER_HEIGHT = 700;

// Types
export type Position = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type PositionWithID = Position & { id: number };

export type VariableType = {
  variable: string;
  value: string | number;
};

export type MarginObject = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ChartConfigs = {
  lineColumnNames: string[];
  barColumnNames: string[];
  leftAxisColumnNames: string[];
  rightAxisColumnNames: string[];
};

export const CustomizableChartDropdownOptions: CustomizableChartTypes[] = [
  ChartType.BAR,
  ChartType.LINE,
];

export const CustomizableAxesDropdownOptions: LeftRight[] = ['LEFT', 'RIGHT'];

// Functions
export const replaceVariable = (
  query: string,
  variable: string,
  value: any
) => {
  const regex = new RegExp(`{{${variable}}}`, 'g');
  const valueWithQuotes = `'` + value + `'`; // put quotes around contracts for ex 'SP3...'. if not, pg considers them an entity
  query = query.replace(regex, valueWithQuotes);
  return query;
};

export const transformPositionBetweenPxAndPerc = (
  pos: number,
  xOrY: 'x' | 'y',
  targetUnit: 'px' | 'perc'
) => {
  if (typeof window == 'undefined') return pos;
  const parent = document?.getElementById('draggables-wrapper');
  if (!parent) return pos;
  const parentRect = parent.getBoundingClientRect();
  const parentDimension = xOrY == 'x' ? parentRect.width : parentRect.height;
  if (targetUnit == 'perc') return (pos / parentDimension) * 100;
  else return (pos / 100) * parentDimension;
};

export const isAvailablePosition = (
  card0: PositionWithID,
  allCharts: PositionWithID[]
) => {
  const positionAvailable = allCharts.every((card1) => {
    if (card0.id == card1.id) return true;
    const x0 = card0.x;
    const y0 = card0.y;
    const width0 = card0.width;
    const height0 = card0.height;

    // Extracting the properties of the second card
    const x1 = card1.x;
    const y1 = card1.y;
    const width1 = card1.width;
    const height1 = card1.height;

    const isRightEdgeBeforeChart1 = x0 + width0 < x1;
    const isLeftEdgeAfterChart1 = x0 > x1 + width1;

    const isTopEdgeAfterChart1 = y0 > y1 + height1;
    const isBottomEdgeBeforeChart1 = y0 + height0 < y1;

    // console.log(
    //   JSON.stringify({
    //     card0,
    //     card1: {
    //       x: card1.x,
    //       y: card1.y,
    //       width: card1.width,
    //       height: card1.height,
    //     },
    //   }),
    //   x0 + width0 < x1,
    //   x1 + width1 < x0,
    //   y0 > y1 + height1,
    //   y0 + height0 < y1,
    //   JSON.stringify({
    //     isLeftEdgeAfterChart1,
    //     isRightEdgeBeforeChart1,
    //     isTopEdgeAfterChart1,
    //     isBottomEdgeBeforeChart1,
    //   })
    // );

    if (isRightEdgeBeforeChart1 || isLeftEdgeAfterChart1) return true;
    if (isTopEdgeAfterChart1 || isBottomEdgeBeforeChart1) return true;

    return false;
  });

  return positionAvailable;
};

export const enumToArray = (e: any) =>
  Object.keys(e).filter((key) => isNaN(Number(key)));

export const getBarAndLineColNames = (
  customizableColumnTypes: CustomizableChartTypes[],
  yNames: string[]
) => {
  let barYNames: string[] = [];
  let lineYNames: string[] = [];
  customizableColumnTypes?.map((type, index) => {
    if (type == ChartType.BAR) barYNames.push(yNames[index]);
    if (type == ChartType.LINE) lineYNames.push(yNames[index]);
  });

  return {
    barYNames,
    lineYNames,
  };
};

export const createChartConfigs = (
  yNames: string[],
  customizableColumnsTypes: ChartType[],
  customizableAxesTypes: LeftRight[]
): ChartConfigs => {
  const leftAxisColumnNames = yNames.filter(
    (_, index) => customizableAxesTypes[index] == 'LEFT'
  );
  const rightAxisColumnNames = yNames.filter(
    (_, index) => customizableAxesTypes[index] == 'RIGHT'
  );

  const lineColumnNames = yNames.filter(
    (_, index) => customizableColumnsTypes[index] == ChartType.LINE
  );
  const barColumnNames = yNames.filter(
    (_, index) => customizableColumnsTypes[index] == ChartType.BAR
  );
  return {
    lineColumnNames,
    barColumnNames,
    leftAxisColumnNames,
    rightAxisColumnNames,
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

// Colors
export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
export const colors = [
  'hsl(var(--chart-2))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
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

export function generateChartConfig(
  chartData: Array<Record<string, any>>
): ChartConfig {
  if (!chartData.length) {
    throw new Error('Invalid chartData or colors array.');
  }

  const keys = Object.keys(chartData[0]);

  const config: ChartConfig = keys.reduce((acc, key, index) => {
    if (index === 0) return acc;

    acc[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: colors[index - 1],
    };

    return acc;
  }, {} as ChartConfig);

  return config;
}

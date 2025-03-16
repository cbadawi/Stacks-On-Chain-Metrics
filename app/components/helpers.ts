import { ChartConfig } from '@/components/ui/chart';
import type { Chart, Dashboard } from '@prisma/client';

export const CHART_CONTAINER_WIDTH = 1100;
export const CHART_CONTAINER_HEIGHT = 700;

export const velarWstx = 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx';

export const aeusdc = 'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc';

// Types
export type Position = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type ChartWithData = { data: any[] } & Chart;

export type DashboardWithCharts = Dashboard & {
  charts: Chart[];
  owner: { address: string };
};

export enum ChartType {
  TABLE = 'TABLE',
  LINE = 'LINE',
  BAR = 'BAR',
  PIE = 'PIE',
  TREEMAP = 'TREEMAP',
  NUMBER = 'NUMBER',
}

export type PositionWithID = Position & { id: number };

export type VariableType = Record<string, string>;

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
  newCard: PositionWithID,
  allCharts: PositionWithID[]
) => {
  const positionAvailable = allCharts.every((currentCard) => {
    if (newCard?.id == currentCard.id) return true;
    return doesOverlap(newCard, currentCard);
  });

  return positionAvailable;
};

export function doesOverlap(card0: Position, card1: Position) {
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
}

export const enumToArray = (e: any) =>
  Object.keys(e).filter((key) => isNaN(Number(key)));

// Colors
export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
export const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
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

export interface ServerResponse<T> {
  success: boolean;
  message: string;
  response: T | null;
}

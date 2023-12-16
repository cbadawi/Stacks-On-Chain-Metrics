import React, { useState } from 'react';
import { BsTable } from 'react-icons/bs';
import {
  FcAreaChart,
  FcLineChart,
  FcBarChart,
  FcPieChart,
  FcFrame,
} from 'react-icons/fc';
import { BiSolidBellRing } from 'react-icons/bi';

import ChartContainer from '../charts/ChartContainer';
import { FiSave, FiDownload } from 'react-icons/fi';
import { MdOutlineNumbers } from 'react-icons/md';
import { CustomizableChartOptions, LeftRight } from '../charts/helpers';
import CustomizeBarChart from './CustomizeBarChart';
import StarterPlaceholderMessage from './StarterPlaceholderMessage';
import QueryFilters from './QueryVariablesForm';
import QueryButtons from './QueryButtons';
import { ChartType } from '@prisma/client';

interface QueryVisualizationProps {
  data: any[];
  query: string;
  customizableColumnsTypes: CustomizableChartOptions[];
  setCustomizableColumnsTypes: React.Dispatch<
    React.SetStateAction<CustomizableChartOptions[]>
  >;
  customizableAxesTypes: LeftRight[];
  setCustomizableAxesTypes: React.Dispatch<React.SetStateAction<LeftRight[]>>;
}

const QueryVisualization = ({
  data,
  query,
  customizableColumnsTypes,
  setCustomizableColumnsTypes,
  customizableAxesTypes,
  setCustomizableAxesTypes,
}: QueryVisualizationProps) => {
  // Note: the diff of linechart vs barchart is that line chart has a brush and only lines
  // whereas the barchart will have a combination of lines and chart but no brush
  const [chartType, setChartType] = useState<ChartType>(ChartType.TABLE);

  return (
    <div className='visualization-container relative my-12 flex w-full flex-col justify-center rounded-t-3xl bg-[#111111] px-5 py-4 md:px-0'>
      {!!data?.length && (
        // todo pass variables
        <QueryButtons
          setChart={setChartType}
          chartType={chartType}
          query={query}
        />
      )}
      {!!data?.length && chartType == ChartType.BAR && (
        <CustomizeBarChart
          columnNames={Object.keys(data[0]).slice(1)}
          customizableColumnTypes={customizableColumnsTypes}
          setCustomizableColumnsTypes={setCustomizableColumnsTypes}
          customizableAxesTypes={customizableAxesTypes}
          setCustomizableAxesTypes={setCustomizableAxesTypes}
        />
      )}
      {!!data?.length && (
        <ChartContainer
          data={data}
          chartType={chartType}
          height={700}
          width={900}
          customizableColumnsTypes={customizableColumnsTypes}
          customizableAxesTypes={customizableAxesTypes}
        />
      )}
      {!data?.length && <StarterPlaceholderMessage />}
      <span>{JSON.stringify(data, null, 2)}</span>
    </div>
  );
};

export default QueryVisualization;

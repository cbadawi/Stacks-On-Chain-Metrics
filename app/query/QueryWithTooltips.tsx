import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { QueryExplanation } from '../lib/types';

export function QueryWithTooltips({
  sql,
  queryExplanations,
}: {
  sql: string;
  queryExplanations: QueryExplanation[];
}) {
  return (
    <div className='flex flex-col items-center justify-center overflow-x-auto rounded-lg bg-muted p-4 font-mono'>
      <h1 className='mb-4 border-b-2 border-white'>Hover over the query</h1>
      {queryExplanations.map((segment, index) => (
        <span key={index}>
          {segment.explanation ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className='inline-block cursor-help rounded-sm px-1 transition-colors duration-200 ease-in-out hover:bg-primary/20'>
                    {segment.section}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side='top'
                  avoidCollisions={true}
                  className='max-w-xl font-sans'
                >
                  <p className='whitespace-normal'>{segment.explanation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            sql
          )}
        </span>
      ))}
    </div>
  );
}

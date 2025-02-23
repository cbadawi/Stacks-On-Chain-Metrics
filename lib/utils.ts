import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_QUERY = `-- To write an AI prompt, start with "-- ai" 
-- followed by your prompt here.

-- Postgresql 15
-- You can use variables by wrapping words in double brackets {{}}
select max(block_height) from blocks;`;

import { Logtail } from '@logtail/node';
import next from 'next';

export const logger = new Logtail(process.env.LOGTAIL_TOKEN!);

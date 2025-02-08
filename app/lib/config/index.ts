export const config = {
  PROD: process.env.NODE_ENV === 'production',
  NODE_ENV: process.env.NODE_ENV,
  TTL_CACHE: parseInt(process.env.TTL_CACHE ?? '60'),
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
};

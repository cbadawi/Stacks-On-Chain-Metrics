import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { createAnthropic } from '@ai-sdk/anthropic';

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(Number(process.env.RL_TOKENS) || 10, '60 s'),
});

const anthropic = createAnthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export const model = anthropic('claude-3-5-haiku-latest');

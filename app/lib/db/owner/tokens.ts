'use server';

import { aeusdc, velarWstx } from '@/app/components/helpers';
import prisma from '../client';

export async function getTokensUsed({ address }: { address: string }) {
  const owner = await prisma.owner.findFirstOrThrow({
    select: { tokens: true },
    where: { address },
  });

  return owner.tokens || 0;
}

export async function updateTokensUsed({
  address,
  tokensUsed,
}: {
  address: string;
  tokensUsed: number;
}) {
  await prisma.owner.update({
    where: { address },
    data: { tokens: { increment: tokensUsed } },
  });
}

const stxMetricsWallet = 'SP2ZWSZGZYQBKNXGD3FR5X43XM5VH30EW519B5PGT';
export async function getTokensPurchased({ address }: { address: string }) {
  const query = `with payments as (select block_height, amount from stx_events where sender = ${address} and recipient = ${stxMetricsWallet})
                 select * 
                 from payments p
                 LEFT JOIN LATERAL (
                  SELECT *
                  FROM prices.dex
                  where dex.tokenx=${velarWstx} and dex.tokeny=${aeusdc} and exchange='velar'
                  ORDER BY ABS(dex.block_height - p.block_height)
                  LIMIT 1
                ) t2 ON true`;

  return 0;
}

export async function getTokensLeft() {}

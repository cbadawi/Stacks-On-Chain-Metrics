'use server';

import { openai } from '@ai-sdk/openai';
import { Client } from 'pg';
import { generateObject } from 'ai';
import { logger } from '../lib/logger';
import { z } from 'zod';
import { explanationsSchema } from '../lib/types';

type Result = Record<string, string | number>;

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

client.connect();

const documentation = `
ft_events: table that contains the token transfers, mints and burns.
when a user mentiones a token name, it might not be the asset_identifier.
For example, map these names to these token identifiers.and only pass a token identifier to the function.
If its not in this list, ask the user to provide you with a token identifier.
STX wrappers:
stx: SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx
BTC Wrappers:
btc: SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-abtc
MEME Coins
welsh: SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token
leo: SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token
charisma: SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.charisma-token
aeusdc: SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc
pepe: SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.tokensoft-token-v4k68639zxz
nothing: SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope
DEX:
alex: SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex
velar: SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token

blocks: 
burn_block_time is the timestamp of the transactions in that block.
`;

const pgSchema = ` postgres database schema:
everything is in the stacks_blockchain_api schema.

        table: stacks_blockchain_api.ft_events
        id integer
        event_index integer
        tx_id bytea
        tx_index smallint
        block_height integer
        index_block_hash bytea
        parent_index_block_hash bytea
        microblock_hash bytea
        microblock_sequence integer
        microblock_canonical boolean
        canonical boolean
        asset_event_type_id smallint
        asset_identifier text
        amount numeric
        sender text
        recipient text

        table: stacks_blockchain_api.blocks
        index_block_hash bytea
        block_hash bytea
        block_height integer
        burn_block_time integer
        burn_block_hash bytea
        burn_block_height integer
        miner_txid bytea
        parent_index_block_hash bytea
        parent_block_hash bytea
        parent_microblock_hash bytea
        parent_microblock_sequence integer
        canonical boolean
        execution_cost_read_count bigint
        execution_cost_read_length bigint
        execution_cost_runtime bigint
        execution_cost_write_count bigint
        execution_cost_write_length bigint
        tx_count integer
        block_time integer
        signer_bitvec bit varying

        table: stacks_blockchain_api.nft_events
        id integer
        event_index integer
        tx_id bytea
        tx_index smallint
        block_height integer
        index_block_hash bytea
        parent_index_block_hash bytea
        microblock_hash bytea
        microblock_sequence integer
        microblock_canonical boolean
        canonical boolean
        asset_event_type_id smallint
        asset_identifier text
        value bytea
        sender text
        recipient text

        table: stacks_blockchain_api.txs
        id integer
        tx_id bytea
        tx_index smallint
        raw_result bytea
        index_block_hash bytea
        block_hash bytea
        block_height integer
        parent_block_hash bytea
        burn_block_time integer
        parent_burn_block_time integer
        type_id smallint
        anchor_mode smallint
        status smallint
        canonical boolean
        post_conditions bytea
        nonce integer
        fee_rate bigint
        sponsored boolean
        sponsor_address text
        sponsor_nonce integer
        sender_address text
        origin_hash_mode smallint
        event_count integer
        execution_cost_read_count bigint
        execution_cost_read_length bigint
        execution_cost_runtime bigint
        execution_cost_write_count bigint
        execution_cost_write_length bigint
        raw_tx bytea
        microblock_canonical boolean
        microblock_sequence integer
        microblock_hash bytea
        parent_index_block_hash bytea
        token_transfer_recipient_address text
        token_transfer_amount bigint
        token_transfer_memo bytea
        smart_contract_clarity_version smallint
        smart_contract_contract_id text
        smart_contract_source_code text
        contract_call_contract_id text
        contract_call_function_name text
        contract_call_function_args bytea
        poison_microblock_header_1 bytea
        poison_microblock_header_2 bytea
        coinbase_payload bytea
        coinbase_alt_recipient text
        coinbase_vrf_proof bytea
        tenure_change_tenure_consensus_hash bytea
        tenure_change_prev_tenure_consensus_hash bytea
        tenure_change_burn_view_consensus_hash bytea
        tenure_change_previous_tenure_end bytea
        tenure_change_previous_tenure_blocks integer
        tenure_change_cause smallint
        tenure_change_pubkey_hash bytea
        block_time integer
        burn_block_height integer
`;

export async function fetchData(query: string) {
  'use server';

  await new Promise((resolve) => setTimeout(resolve, 1500));
  logger.info('fetching data', { query });
  let data: any;
  try {
    console.log('awaiting sql query', { query });
    const res = await client.query(query);
    console.log('query result', { res });
    data = res;
  } catch (e: any) {
    console.error('query error', { e });
    throw e;
  }

  return data.rows as Result[];
}

// return [
//   // { month: 'January 1', value: 100, amount: 186 },
//   // { month: 'February 1', value: 100, amount: 305 },
//   // { month: 'March 1', value: 100, amount: 237 },
//   // { month: 'April 1', value: 100, amount: 73 },
//   // { month: 'May 1', value: 100, amount: 209 },
//   // { month: 'June 1', value: 100, amount: 214 },
//   // { month: 'January 2', value: 100, amount: 186 },
//   // { month: 'February 2', value: 100, amount: 305 },
//   // { month: 'March 2', value: 100, amount: 237 },
//   // { month: 'April 2', value: 100, amount: 73 },
//   // { month: 'May 2', value: 100, amount: 209 },
//   // { month: 'June 2', value: 100, amount: 214 },
//   // { month: 'January 3', value: 100, amount: 186 },
//   // { month: 'February 3', value: 100, amount: 305 },
//   { month: 'March 3', value: 100, amount: 237 },
//   { month: 'April 3', value: 100, amount: 73 },
//   { month: 'May 3', value: 100, amount: 209 },
//   { month: 'June 3', value: 100, amount: 214 },
//   { month: 'January 3', value: 100, amount: 186 },
//   { month: 'February 3', value: 100, amount: 305 },
//   { month: 'March 3', value: 100, amount: 237 },
//   { month: 'April 3', value: 100, amount: 73 },
//   { month: 'May 3', value: 100, amount: 209 },
//   { month: 'June 3', value: 100, amount: 214 },
//   { month: 'January 4', value: 100, amount: 186 },
//   { month: 'February 4', value: 100, amount: 305 },
//   { month: 'March 4', value: 100, amount: 237 },
//   { month: 'April 4', value: 100, amount: 73 },
//   { month: 'May 4', value: 100, amount: 209 },
//   { month: 'June 4', value: 100, amount: 214 },
//   { month: 'January 5', value: 100, amount: 186 },
//   { month: 'February 5', value: 100, amount: 305 },
//   { month: 'March 5', value: 100, amount: 237 },
//   { month: 'April 5', value: 100, amount: 73 },
//   { month: 'May 5', value: 100, amount: 209 },
//   { month: 'June 5', value: 100, amount: 214 },
// ];
// }

export const explainQuery = async (userPrompt: string, sqlQuery: string) => {
  'use server';
  try {
    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        explanations: explanationsSchema,
      }),
      system: `You are a SQL (postgres) expert for the stacks (stx) cryptocurrency on-chain data. Your job is to explain to the user write a SQL query you wrote to retrieve the data they asked for. The table schema is as follows:
      ${pgSchema}
      When you explain you must take a section of the query, and then explain it. Each "section" should be unique. So in a query like: "SELECT * FROM blocks limit 20", the sections could be "SELECT *", "FROM blocks", "LIMIT 20".
      If a section doesnt have any explanation, include it, but leave the explanation empty.
      `,
      prompt: `Explain the SQL query to retrieve the data the user wanted. Assume the user is an idiot in SQL. Break down the query into steps. Be concise.
      ${userPrompt ? 'User AI Prompt for context: ' + userPrompt : ''}

      Generated SQL Query:
      ${sqlQuery}`,
    });
    return result.object;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate explainQuery');
  }
};

export const generateQuery = async (input: string) => {
  'use server';
  try {
    console.log('generate query input: ' + input);
    const result = await generateObject({
      model: openai('gpt-3.5-turbo'),
      system: `You are a SQL (postgres) expert for the stacks (stx) cryptocurrency on-chain data. Help the user write a SQL query to retrieve the data they need. The database schema is as follows: You are only allowed to select data from these tables
        Only select retrieval queries are allowed.
        
        ${documentation}
        ${pgSchema}
      `,
      prompt: `Generate the query necessary to retrieve the data the user wants. Format the query, add a tab or new line seperators where needed. user input: ${input}`,
      schema: z.object({
        query: z.string(),
      }),
    });

    console.log({ 'result.object.query': result.object.query });
    return result.object.query;
  } catch (e) {
    console.error('!!!!' + e);
    throw new Error('Failed to generateQuery ' + e);
  }
};

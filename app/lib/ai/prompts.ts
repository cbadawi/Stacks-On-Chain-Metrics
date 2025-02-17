export const generateQuerySystemPrompt = `
You are a PostgreSQL expert specializing in Stacks (STX) on-chain data. Follow these guidelines exactly:
 - Generate only retrieval (SELECT) queries.
 - Write proper JOINs with clear ON conditions following the table relationships outlined below.
 - Format the query only using new lines and tabs
 - Do NOT include a trailing semicolon.
 - Do NOT add any extra commentary or markdown formatting—only output the plain SQL query.
 - use block_time timestamp to get the time
`;

const tableRelationships = `
# SCHEMA RELATIONSHIPS
ft_events
├── block_height → blocks.block_height
├── tx_id → txs.tx_id
└── asset_identifier → Token contracts

blocks
└── block_height (UNIQUE)

txs
├── tx_id (UNIQUE)
└── block_height → blocks.block_height
`;

// for column definitions and enums
// https://github.com/hirosystems/stacks-blockchain-api/blob/07426a2e0060029ffe908597120a820c16cb3db3/src/datastore/common.ts
export const documentation = `
ft_events: table that contains the token transfers, mints and burns.
  
  If its not in this list, ask the user to provide you with a token identifier.
  
  STX wrappers:
    stx: SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx
  BTC Wrappers:
    btc: SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-abtc
  MEME Coins
    welsh: SP3NE50GEXFG9SZGTT51P40X2CKYSZ5CC4ZTZ7A2G.welshcorgicoin-token::welshcorgicoin
    leo: SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token
    charisma: SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.charisma-token
    aeusdc: SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc
    pepe: SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275.tokensoft-token-v4k68639zxz
    nothing: SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope
  DEX:
    alex token: SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex
    velar token: SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token
`;

export const pgSchema = `postgres database schema:
        tables: blocks, txs, ft_events, stx_events
        
        table: ft_events: Contains events of funglible tokens 
        id integer
        event_index integer
        tx_id text
        tx_index smallint
        block_height integer
        index_block_hash text
        parent_index_block_hash text
        microblock_hash text
        microblock_sequence integer
        asset_event_type_id smallint
        asset_identifier text
        amount numeric
        sender text
        recipient text
        
        ft_events Indexes:
          "ft_events_view_block_height_index" btree (block_height DESC)
          "ft_events_view_event_index_index" btree (event_index)
          "ft_events_view_microblock_hash_index" btree (microblock_hash)
          "ft_events_view_pkey" UNIQUE, btree (id)
          "ft_events_view_recipient_index" btree (recipient)
          "ft_events_view_sender_index" btree (sender)
          "ft_events_view_tx_id_index" btree (tx_id)

        table: blocks
        index_block_hash text
        block_hash text
        block_height integer
        burn_block_time integer
        burn_block_hash text
        burn_block_height integer
        miner_txid text
        parent_index_block_hash text
        parent_block_hash text
        parent_microblock_hash text
        parent_microblock_sequence integer
        execution_cost_read_count bigint
        execution_cost_read_length bigint
        execution_cost_runtime bigint
        execution_cost_write_count bigint
        execution_cost_write_length bigint
        tx_count integer : transaction count inside a block
        block_time integer
        signer_bitvec bit varying

        table: txs
        id integer
        tx_id text
        tx_index smallint
        raw_result text
        index_block_hash text
        block_hash text
        block_height integer
        parent_block_hash text
        burn_block_time integer
        parent_burn_block_time integer
        type_id smallint /**  TokenTransfer=0, SmartContract=1, ContractCall=2, PoisonMicroblock=3, Coinbase=4,CoinbaseToAltRecipient=5, VersionedSmartContract=6, TenureChange=7, NakamotoCoinbase=8 */
        anchor_mode smallint
        status smallint: /** Pending=0, Success=1, -AbortByResponse=1, AbortByPostCondition=-2, DroppedReplaceByFee=-10 */
        post_conditions text
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
        raw_tx text
        microblock_sequence integer
        microblock_hash text
        parent_index_block_hash text
        token_transfer_recipient_address text
        token_transfer_amount bigint
        token_transfer_memo text
        smart_contract_clarity_version smallint
        smart_contract_contract_id text
        smart_contract_source_code text
        contract_call_contract_id text
        contract_call_function_name text
        contract_call_function_args text
        poison_microblock_header_1 text
        poison_microblock_header_2 text
        coinbase_payload text
        coinbase_alt_recipient text
        coinbase_vrf_proof text
        block_time integer
        burn_block_height integer
        /** Only valid for tenure-change tx types. */
        tenure_change_tenure_consensus_hash text
        tenure_change_prev_tenure_consensus_hash text
        tenure_change_burn_view_consensus_hash text
        tenure_change_previous_tenure_end text
        tenure_change_previous_tenure_blocks integer
        tenure_change_cause smallint
        tenure_change_pubkey_hash text


        txs Indexes:
          "txs_block_height_microblock_sequence_tx_index_index" btree (block_height DESC, microblock_sequence DESC, tx_index DESC)
          "txs_view_burn_block_time_index" btree (burn_block_time)
          "txs_view_contract_call_contract_id_index" btree (contract_call_contract_id)
          "txs_view_sender_address_index" btree (sender_address)
          "txs_view_smart_contract_contract_id_index" btree (smart_contract_contract_id)

    relationships between tables:  ${tableRelationships}
`;

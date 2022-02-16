import { deserializeUnchecked } from 'borsh'

export const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
export const CREATOR_ARRAY_START = 1
const MAX_NAME_LENGTH = 32
const MAX_SYMBOL_LENGTH = 10
const MAX_URI_LENGTH = 200
const MAX_CREATOR_LIMIT = 5
const MAX_CREATOR_LEN = 32 + 1 + 1

export const MAX_DATA_SIZE = 4
  + MAX_NAME_LENGTH
  + 4
  + MAX_SYMBOL_LENGTH
  + 4
  + MAX_URI_LENGTH
  + 2
  + 1
  + 4
  + MAX_CREATOR_LIMIT * MAX_CREATOR_LEN

export const MAX_METADATA_LEN = 1 // key 
  + 32 // update auth pubkey
  + 32 // mint pubkey
  + MAX_DATA_SIZE 
  + 1 // primary sale
  + 1 // mutable
  + 9 // nonce (pretty sure this only needs to be 2)
  + 34 // collection
  + 18 // uses
  + 2 // token standard
  + 118 // padding

export const metadata = {
  name: 'Test NFT',
  symbol: 'TNFT',
  creators: [],
  description: 'Testing MINT of NFT',
  sellerFeeBasisPoints: 0,
  image: '',
  animation_url: '',
  attributes: [],
  external_url: '',
  properties: {
    files: [],
    category: 'image'
  }
}

export const MetadataKey = {
  Uninitialized: 0,
  MetadataV1: 4,
  EditionV1: 1,
  MasterEditionV1: 2,
  MasterEditionV2: 6,
  EditionMarker: 7
}

export class Metadata {
  constructor(args) {
    this.key = MetadataKey.MetadataV1;
    this.updateAuthority = args.updateAuthority;
    this.mint = args.mint;
    this.data = args.data;
    this.primarySaleHappened = args.primarySaleHappened;
    this.isMutable = args.isMutable;
    this.editionNonce = args.editionNonce ?? null;
    this.tokenStandard = args.tokenStandard ?? null;
    this.collection = args.collection ?? null;
    this.uses = args.uses ?? null;
  }
}

export class Data {
  constructor(args) {
    this.name = args.name;
    this.symbol = args.symbol;
    this.uri = args.uri;
    this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
    this.creators = args.creators;
  }
}

export class Creator { 
  constructor(args) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}

export class Collection {
  constructor(args) {
    this.key = args.key;
    this.verified = args.verified;
  }
}

export class Uses {
  constructor(args) {
    this.useMethod = args.useMethod;
    this.remaining = args.remaining;
    this.total = args.total;
  }
}

export class CreateMetadataArgs {
  instruction = 0;

  constructor(args) {
    this.data = args.data;
    this.isMutable = args.isMutable;
  }
}

export class UpdateMetadataArgs {
  instruction = 1;

  constructor(args) {
    this.data = args.data ? args.data : null;
    this.updateAuthority = args.updateAuthority ? args.updateAuthority : null;
    this.primarySaleHappened = args.primarySaleHappened;
  }
}

export const METADATA_SCHEMA = new Map([
  [
    CreateMetadataArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['data', Data],
        ['isMutable', 'u8'], // bool
      ],
    },
  ],
  [
    UpdateMetadataArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['data', { kind: 'option', type: Data }],
        ['updateAuthority', { kind: 'option', type: 'pubkey' }],
        ['primarySaleHappened', { kind: 'option', type: 'u8' }],
      ],
    },
  ],
  [
    Data,
    {
      kind: 'struct',
      fields: [
        ['name', 'string'],
        ['symbol', 'string'],
        ['uri', 'string'],
        ['sellerFeeBasisPoints', 'u16'],
        ['creators', { kind: 'option', type: [Creator] }],
      ],
    },
  ],
  [
    Creator,
    {
      kind: 'struct',
      fields: [
        ['address', 'pubkey'],
        ['verified', 'u8'],
        ['share', 'u8'],
      ],
    },
  ],
  [
    Metadata,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['updateAuthority', 'pubkey'],
        ['mint', 'pubkey'],
        ['data', Data],
        ['primarySaleHappened', 'u8'], // bool
        ['isMutable', 'u8'], // bool
        ['editionNonce', { kind: 'option', type: 'u8' }],
        ['tokenStandard', { kind: 'option', type: 'u8' }],
        ['collection', { kind: 'option', type: Collection }],
        ['uses', { kind: 'option', type: Uses }],
      ],
    },
  ],
  [
    Collection,
    {
      kind: 'struct',
      fields: [
        ['verified', 'u8'],
        ['key', 'pubkey'],
      ],
    },
  ],
  [
    Uses,
    {
      kind: 'struct',
      fields: [
        ['useMethod', 'u8'],
        ['remaining', 'u64'],
        ['total', 'u64'],
      ],
    },
  ],
])

export const decodeMetadata = buffer => {
  return deserializeUnchecked(METADATA_SCHEMA, Metadata, buffer)
}
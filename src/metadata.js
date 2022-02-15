export const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'

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
  ]
])
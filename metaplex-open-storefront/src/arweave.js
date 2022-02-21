import { ArweaveStorage } from '@metaplex/js'

const ARWEAVE_UPLOAD_ENDPOINT = 'https://us-central1-metaplex-studios.cloudfunctions.net/uploadFile'
export const AR_SOL_HOLDER_ID = '6FKvsq4ydWFci6nGq9ckbjYMtnmaqAoatz5c9XWjiDuS'
export const arweave = new ArweaveStorage({ 
  endpoint: ARWEAVE_UPLOAD_ENDPOINT, 
  env: 'devnet' 
})

export default arweave
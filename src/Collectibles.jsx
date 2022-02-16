import Button from 'react-bootstrap/Button'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { PublicKey } from '@solana/web3.js'
import { METADATA_PROGRAM_ID, MAX_METADATA_LEN, MAX_DATA_SIZE, CREATOR_ARRAY_START, decodeMetadata } from './metadata'
import { useCallback, useState } from 'react'
import bs58 from 'bs58'
import { programs } from '@metaplex/js'

function Collectibles() {
  const [collectibles, setCollectibles] = useState([])

  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const loadCollectiblesHandler = useCallback(
    async () => {
      if (!publicKey) throw new WalletNotConnectedError()

      // 1. Get Metadata accounts
      const metadataProgram = { publicKey: new PublicKey(METADATA_PROGRAM_ID) }
      const metadataAccounts = await connection.getProgramAccounts(
        metadataProgram.publicKey,
        {
          // The mint address is located at byte 33 and lasts for 32 bytes.
          dataSlice: { offset: 33, length: 32 },
          filters: [
            { dataSize: MAX_METADATA_LEN }, // Only get Metadata accounts.
            { 
              memcmp: 
              { 
                offset: 1, 
                bytes: publicKey.toBase58()
              }
            }
          ]
        }
      )

      const accountData = metadataAccounts.map(ma => bs58.encode(ma.account.data))
      const tokenMint = new PublicKey(accountData[1])

      // 2. Get NFT Metadata
      const collectibles = await programs.metadata.Metadata.findByMint(connection, tokenMint)
      console.log('collectibles', collectibles)

    },
    [publicKey, collectibles, connection]
  )

  return (
    <div>
      <h2>Your Collectibles</h2>
      
      <Button onClick={loadCollectiblesHandler} disabled={!publicKey}>Load Collectibles</Button>

      <div>

      </div>
    </div>
  )
}

export default Collectibles
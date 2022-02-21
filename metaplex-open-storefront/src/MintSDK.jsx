import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { actions, programs, transactions } from '@metaplex/js'
import { calculate } from '@metaplex/arweave-cost';
import arweave, { AR_SOL_HOLDER_ID } from './arweave'
import { useCallback, useState } from 'react'
import aicat from './aicat.jpg'

function MintSDK() {  
  const { mintNFT, updateMetadata, sendTransaction } = actions
  const { metadata: { MetadataDataData, Creator }} = programs
  const { PayForFiles } = transactions

  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  
  const [isMinting, setIsMinting] = useState(false)

  const mintHandler = useCallback(
    async () => {
      try {
        if (!wallet.publicKey) throw new WalletNotConnectedError()
        
        setIsMinting(true)

        // 1. Create/upload files (art & metadata)
        const image = 'aicat.jpg'
        const req = await fetch(aicat)
        const blob = await req.blob()
        const nftFile = new File([blob], image)

        const metadataJson = {
          name: 'SDK NFT',
          symbol: 'SNFT',
          description: 'Testing MINT of NFT via SDK',
          sellerFeeBasisPoints: 7,
          image,
          properties: {
            category: 'image',
            files: [{ uri: image, type: 'image/jpeg' }],
            creators: [{ address: wallet.publicKey.toBase58(), share: 100, verified: true }]
          }
        }

        const metadataFile = new File([JSON.stringify(metadataJson)], 'metadata.json')

        // 2. Mint NFT
        const uri = URL.createObjectURL(metadataFile)
        const mintResponse = await mintNFT({ connection, wallet, uri })

        // 3. Pay for file storage
        const editionMint = mintResponse.mint
        const files = [nftFile, metadataFile]
        const sizes = files.map(f => f.size)
        const storageCost = await calculate(sizes)
        const encoder = new TextEncoder()
        const filesHexHashes = files.map(async (file) => {
          const encodedFile = encoder.encode(file.text())
          const hashBuffer = await crypto.subtle.digest('SHA-256', encodedFile)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        })

        const options = { feePayer: wallet.publicKey }
        const params = {
          lamports: LAMPORTS_PER_SOL * storageCost.solana * 1.5,
          fileHashes: Buffer.from(filesHexHashes),
          arweaveWallet: new PublicKey(AR_SOL_HOLDER_ID)
        }
        const payForFilesTx = new PayForFiles(options, params)
        const txId = await sendTransaction({ connection, wallet, txs: [payForFilesTx] })

        // 4. Upload files
        const filesMap = new Map(files.map(f => [f.name, f]))
        const uploadResult = await arweave.upload(filesMap, editionMint.toBase58(), txId)

        // 5. Update metadata uri
        const manifestFile = uploadResult.messages.find(m => m.filename === 'manifest.json')
        const arweaveLink = `https://arweave.net/${manifestFile.transactionId}`;

        const newMetadataData = new MetadataDataData({
          name: metadataJson.name,
          symbol: metadataJson.symbol,
          uri: arweaveLink,
          sellerFeeBasisPoints: metadataJson.sellerFeeBasisPoints,
          creators: [
            new Creator({ 
              address: wallet.publicKey.toBase58(), 
              share: 100, 
              verified: true 
            })
          ]
        })

        const result = await updateMetadata({ connection, wallet, editionMint, newMetadataData })
        console.log('result', result)

        setIsMinting(false)
      } catch (error) {
        console.log(error)
        setIsMinting(false)
      }
    },
    [wallet, connection]
  )

  return (
    <Button onClick={mintHandler} disabled={!wallet}>
      {isMinting && <Spinner as="span" animation="grow" size="sm" />}
      {isMinting ? ' Minting...' : 'Mint SDK'}
    </Button>
  )
}

export default MintSDK
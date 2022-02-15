import Button from 'react-bootstrap/Button'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { Transaction, Keypair, SystemProgram, PublicKey, TransactionInstruction, SYSVAR_RENT_PUBKEY, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, MintLayout } from '@solana/spl-token'
import { CreateMetadataArgs, Data, Creator, metadata, METADATA_PROGRAM_ID, METADATA_SCHEMA } from './metadata'
import { calculate } from '@metaplex/arweave-cost';
import { serialize } from 'borsh'
import { useCallback } from 'react'

function Mint() {  
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const mintHandler = useCallback(
    async () => {
      if (!publicKey) throw new WalletNotConnectedError()
      
      // 0. Pay for upload
      const metadataContent = {
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        seller_fee_basis_points: metadata.sellerFeeBasisPoints,
        image: metadata.image,
        animation_url: metadata.animation_url,
        attributes: metadata.attributes,
        external_url: metadata.external_url,
        properties: {
          ...metadata.properties,
          creators: [{ address: publicKey.toBase58(), share: 100 }]
        }
      }

      const AR_SOL_HOLDER_ID = '6FKvsq4ydWFci6nGq9ckbjYMtnmaqAoatz5c9XWjiDuS'
      const arHolder = new PublicKey(AR_SOL_HOLDER_ID)
      const metadataFile = new File([JSON.stringify(metadataContent)], 'metadata.json')
      const storageCost = await calculate([metadataFile.size])

      const payForStorageInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: arHolder,
        lamports: LAMPORTS_PER_SOL * storageCost.solana
      })

      const MEMO_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
      const memoProgram = new PublicKey(MEMO_ID)

      const encoder = new TextEncoder()
      const encodedMetadata = encoder.encode(metadataFile.text())
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedMetadata)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      const storageHashInstruction = new TransactionInstruction({
        keys: [],
        programId: memoProgram,
        data: Buffer.from(hashHex)
      })

      // 1. Create the mint account
      const mintAccount = Keypair.generate()
      const mintRent = await connection.getMinimumBalanceForRentExemption(
        MintLayout.span,
      )

      const createMintAccountInstruction = SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintAccount.publicKey,
        lamports: mintRent,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID
      })

      const createInitMintInstruction = Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        0,
        publicKey,
        publicKey
      )

      // 2. Create associated token account
      const associatedTokenPDA = await PublicKey.findProgramAddress(
        [
          publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintAccount.publicKey.toBuffer()
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )

      const createAssociatedTokenAccountInstruction = Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        associatedTokenPDA[0],
        publicKey,
        publicKey
      )

      // 3. Create Metadata account
      const metadataProgram = { publicKey: new PublicKey(METADATA_PROGRAM_ID) }
      const metadataPDA = await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          metadataProgram.publicKey.toBuffer(),
          mintAccount.publicKey.toBuffer()
        ],
        metadataProgram.publicKey
      )

      const createMetadataAccountInstruction = new TransactionInstruction({
        keys: [
          { pubkey: metadataPDA[0], isSigner: false, isWritable: true },
          { pubkey: mintAccount.publicKey, isSigner: false, isWritable: false },
          { pubkey: publicKey, isSigner: true, isWritable: false }, // mint authority
          { pubkey: publicKey, isSigner: true, isWritable: false }, // payer
          { pubkey: publicKey, isSigner: false, isWritable: false }, // update authority
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
        ],
        programId: metadataProgram.publicKey,
        data: Buffer.from(serialize(
          METADATA_SCHEMA, 
          new CreateMetadataArgs({
            data: new Data({
              name: metadata.name,
              symbol: metadata.symbol,
              uri: ' '.repeat(64), // size of url for arweave
              // sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
              creators: [
                new Creator({ address: publicKey, verified: true, share: 100 })
              ]
            }),
            isMutable: true
          })
        ))
      })

      // 4. Create and send transaction
      const tx = new Transaction().add(
        // payForStorageInstruction,
        // storageHashInstruction,
        createMintAccountInstruction,
        createInitMintInstruction,
        createAssociatedTokenAccountInstruction,
        createMetadataAccountInstruction
      )

      const signature = await sendTransaction(tx, connection, { signers: [mintAccount]})
      const result = await connection.confirmTransaction(signature, 'processed')

      console.log('result', result)

    },
    [publicKey, sendTransaction, connection]
  )

  return (
    <Button onClick={mintHandler} disabled={!publicKey}>Mint</Button>
  )
}

export default Mint
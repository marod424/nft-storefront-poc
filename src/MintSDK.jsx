import Button from 'react-bootstrap/Button'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useCallback } from 'react'

function MintSDK() {
  const { publicKey } = useWallet()

  const mintSDKHandler = useCallback(
    async () => {
      if (!publicKey) throw new WalletNotConnectedError()
    
      console.log('mintSDKHandler')

    },
    [publicKey]
  )

  return (
    <Button onClick={mintSDKHandler} disabled={!publicKey}>Mint SDK</Button>
  )
}

export default MintSDK
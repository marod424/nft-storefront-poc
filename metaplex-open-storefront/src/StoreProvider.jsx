import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { actions, programs } from '@metaplex/js'
import { StoreContext } from './useStore'
import { useState, useEffect } from 'react'

function StoreProvider({ children }) {
  const { initStore } = actions
  const { metaplex: { Store }, core: { ErrorCode }} = programs

  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  const [store, setStore] = useState()
  
  useEffect(
    async () => {
      if (!wallet?.publicKey) {
        setStore(null)
        return
      }

      try {
        const pda = await Store.getPDA(wallet.publicKey)
        const storeLoad = await Store.load(connection, pda)
        const { pubkey, data } = storeLoad

        console.log('store already exists', pubkey)

        setStore({ address: pubkey.toBase58(), isPublic: data.public })

      } catch (e) {
        if (e.errorCode === ErrorCode.ERROR_ACCOUNT_NOT_FOUND) {
          const isPublic = true
          const { storeId, txId } = await initStore({ connection, wallet, isPublic })

          console.log('init store tx', txId)

          setStore({ address: storeId.toBase58(), isPublic })
        } 
        else {
          console.error(e)
        }
      }
    },
    [wallet, connection]
  )

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
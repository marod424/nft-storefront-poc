import { Provider, defaultChains, InjectedConnector } from 'wagmi'

function WalletContext({ children }) {
  const chains = defaultChains
  const connectors = [
    new InjectedConnector({ chains })
  ]
  
  return (
    <Provider connectors={connectors} autoConnect>
      {children}
    </Provider>
  )
}

export default WalletContext
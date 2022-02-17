import WalletContext from './WalletContext'
import Wallet from './Wallet'
import Mint from './Mint'
import Collectibles from './Collectibles'
import './App.css'

function App() {
  return (
    <WalletContext>
      <Wallet />
      <Mint />
      <Collectibles />
    </WalletContext>
  )
}

export default App

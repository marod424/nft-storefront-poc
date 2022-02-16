import Wallet from './Wallet'
import Mint from './Mint'
import Collectibles from './Collectibles'
import './App.css'

function App() {
  return (
    <Wallet>
      <Mint />
      <Collectibles />
    </Wallet>
  )
}

export default App

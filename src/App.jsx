import Wallet from './Wallet'
import Mint from './Mint'
import MintSDK from './MintSDK'
import './App.css'

function App() {
  return (
    <Wallet>
      <Mint />
      <MintSDK />
    </Wallet>
  )
}

export default App

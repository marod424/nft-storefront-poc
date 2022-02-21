import WalletContext from './WalletContext'
import Store from './Store'
import './App.css'

function App() {
  return (
    <WalletContext>
      <Store />
    </WalletContext>
  )
}

export default App

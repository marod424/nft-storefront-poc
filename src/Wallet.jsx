import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

function Wallet() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Open Storefront</Navbar.Brand>
        <WalletMultiButton />
      </Container>
    </Navbar>
  )
}

export default Wallet
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useStore } from './useStore'

function Header() {
  const store = useStore()

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          {store ? (store.isPublic ? 'Open' : 'Private') : ''} 
          {store ? ` Storefront - ${store.address}` : 'Marketplace'}
        </Navbar.Brand>
        <WalletMultiButton />
      </Container>
    </Navbar>
  )
}

export default Header
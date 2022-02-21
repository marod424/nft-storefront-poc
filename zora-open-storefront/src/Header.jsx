import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Wallet from './Wallet'

function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Open Marketplace</Navbar.Brand>
        <Wallet />
      </Container>
    </Navbar>
  )
}

export default Header
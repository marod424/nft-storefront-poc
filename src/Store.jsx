import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Mint from './Mint'
import MintSDK from './MintSDK'
import Collectibles from './Collectibles'
import Sales from './Sales'
import Header from './Header'
import StoreProvider from './StoreProvider'

function Store() {
  return (
    <StoreProvider>
      <Header />
        <Container>
          <Row className="justify-content-md-center">
            <Col md="auto"><Mint /></Col>
            <Col md="auto"><MintSDK /></Col>
          </Row>
          <Row>
            <Col><Sales /></Col>
            <Col><Collectibles /></Col>
          </Row>
        </Container>
    </StoreProvider>
  )
}

export default Store
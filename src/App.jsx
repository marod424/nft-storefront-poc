import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import WalletContext from './WalletContext'
import Wallet from './Wallet'
import Mint from './Mint'
import MintSDK from './MintSDK'
import Collectibles from './Collectibles'
import Sales from './Sales'
import './App.css'

function App() {
  return (
    <WalletContext>
      <Wallet />

      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Mint />
          </Col>
          <Col md="auto">
            <MintSDK />
          </Col>
        </Row>
        <Row>
          <Col>
            <Sales />
          </Col>
          <Col>
            <Collectibles />
          </Col>
        </Row>
      </Container>
    </WalletContext>
  )
}

export default App

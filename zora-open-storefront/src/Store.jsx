import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Header from './Header'

function Store() {
  return (
    <>
      <Header />
        <Container>
          <Row className="justify-content-md-center">
            <Col md="auto"><pre>TODO: Mint</pre></Col>
          </Row>
          <Row>
            <Col><pre>TODO: Sales</pre></Col>
            <Col><pre>TODO: Collectibles</pre></Col>
          </Row>
        </Container>
    </>
  )
}

export default Store
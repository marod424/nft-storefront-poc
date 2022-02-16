import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { programs } from '@metaplex/js'

function Collectibles() {
  const [isLoading, setIsLoading] = useState(false)
  const [collectibles, setCollectibles] = useState([])
  const [images, setImages] = useState([])

  const { connection } = useConnection()
  const { publicKey } = useWallet()

  useEffect(
    async () => {
      if (!publicKey) return

      setIsLoading(true)

      const { metadata: { Metadata }} = programs
      const data = await Metadata.findDataByOwner(connection, publicKey)
      const collectibles = data.map(d => d.data)

      setCollectibles(collectibles)
      setIsLoading(false)

      console.log('collectibles', collectibles)
    },
    [publicKey, connection]
  )

  useEffect(
    async () => {
      const uris = collectibles.map(c => c.uri)

      Promise.all
      (
        uris.map(async (uri) => {
          const res = await fetch(uri)
          return res.json()
        })
      )
      .then(result => setImages(result.map(r => r.image)))

    },
    [collectibles]
  )

  return (
    <Container>
      <Row>
        <Col><h3>Your Collectibles</h3></Col>
      </Row>

      <Row>
        {isLoading && <Spinner animation="border" />}

        {collectibles.map((item, index) => {
          return <pre key={index}>{item.uri}</pre>
        })}
      </Row>

      <Row>
        {images.map((img, index) => {
          return (
            <Col key={index}>
              <img src={img} width="200" height="200" />
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default Collectibles
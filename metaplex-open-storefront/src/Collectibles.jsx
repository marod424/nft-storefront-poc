import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect, useCallback } from 'react'
import { programs } from '@metaplex/js'

function Collectibles() {
  const [isLoading, setIsLoading] = useState(false)
  const [collectibles, setCollectibles] = useState([])
  const [images, setImages] = useState([])

  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  useEffect(
    async () => {
      if (!wallet?.publicKey) {
        setCollectibles([])
        return
      }

      setIsLoading(true)

      const { metadata: { Metadata }} = programs
      const data = await Metadata.findByOwnerV2(connection, wallet.publicKey)
      const collectibles = data.map(d => d.data)

      setCollectibles(collectibles)
      setIsLoading(false)

      console.log('collectibles', collectibles)
    },
    [wallet, connection]
  )

  useEffect(
    async () => {
      const uris = collectibles.map(c => c.data.uri)

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

  const handleListForSale = useCallback(
    async (index) => {
      console.log('handleListForSale', index)
      console.log('collectible', collectibles[index])

      const collectible = collectibles[index]
      const mint = collectible.mint

      console.log('mint', mint)
    },
    [wallet, connection]
  )

  return (
    <Container>
      <Row>
        <Col><h3>Your Collectibles</h3></Col>
      </Row>

      <Row>
        {isLoading && <Spinner animation="border" />}
        {!isLoading && images.map((img, index) => {
          return (
            <Col key={index}>
              <Image 
                src={img} 
                onClick={() => handleListForSale(index)} 
                rounded="true" 
                width="200" 
                height="200" 
              />
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default Collectibles
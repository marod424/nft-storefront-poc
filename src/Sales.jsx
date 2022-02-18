import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { programs } from '@metaplex/js'

function Sales() {
  const [isLoading, setIsLoading] = useState(false)
  const [sales, setSales] = useState([])
  const [images, setImages] = useState([])

  const { connection } = useConnection()
  const { publicKey } = useWallet()

  useEffect(
    async () => {
      if (!publicKey) return

      // setIsLoading(true)

      // const { metadata: { Metadata }} = programs
      // const data = await Metadata.findDataByOwner(connection, publicKey)
      // const collectibles = data.map(d => d.data)

      // setSales(collectibles)
      // setIsLoading(false)

      // console.log('collectibles', collectibles)
    },
    [publicKey, connection]
  )

  return (
    <Container>
      <Row>
        <Col><h3>Sales</h3></Col>
      </Row>
    </Container>
  )
}

export default Sales
import { useMemo } from 'react'
import Button from 'react-bootstrap/Button'
import { useConnect, useAccount } from 'wagmi'

function Wallet() {
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount()
  const { connected, connectors } = connectData

  
  const handleClick = (connector) => {
    connected ? disconnect() : connect(connector)
  }
  
  const getShortAddress = useMemo(() => {
    const address = accountData?.address
    const shortAddress = `${address?.slice(0, 4)}..${address?.slice(-4)}`

    return shortAddress
  }, [accountData])

  return (
    <div>
      {connectors.map(connector => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => handleClick(connector)}
        >
          {connected ? `Disconnect ${getShortAddress}` : `Connect to ${connector.name}`}
        </Button>
      ))}
    </div>
  )
}

export default Wallet
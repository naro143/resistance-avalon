import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import io from 'socket.io-client'
import { Container, Button, InputBase, Box } from '@material-ui/core'
import { MeetingRoom } from '@material-ui/icons'

type ContainerProps = {}

type EnterRoomType = {
  roomKey: string
}

const Home = (props: ContainerProps) => {
  const [socket, _] = useState(() => io())
  const [isConnected, setIsConnected] = useState(false)
  const [newEnterRoom, setNewEnterRoom] = useState<EnterRoomType>({
    roomKey: '',
  })
  const [roomKey, setRoomKey] = useState<string>('')

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected!!')
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('socket disconnected!!')
      setIsConnected(false)
    })
    socket.on('update-data', (newData: EnterRoomType) => {
      console.log('Get Updated Data', newData)
      setNewEnterRoom(newData)
    })

    return () => {
      socket.close()
    }
  }, [])

  const handleSubmit = async () => {
    await fetch(location.href + 'room', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomKey,
      })
    })
    setRoomKey('')
  }

  return (
    <StyledComponent
      {...props}
      isConnected={isConnected}
      roomKey={roomKey}
      setRoomKey={setRoomKey}
      handleSubmit={handleSubmit}
    />
  )
}

type Props = ContainerProps & {
  className?: string
  isConnected: boolean
  roomKey: string
  setRoomKey: (value: string) => void
  handleSubmit: () => void
}

const Component = (props: Props) => (
  <Container maxWidth="sm" className={props.className}>
    <Box height="100vh" display="flex" flexDirection="column">
      <Box flexGrow={1} overflow="hidden" display="flex" flexDirection="column" justifyContent="center">
        <h1>RESISTANCE AVALON</h1>
        <Box display="flex" border={1} borderRadius={5} borderColor="grey.500">
          <Box p={1} flex={1}>
            <InputBase
              required
              placeholder="Please enter your ROOM ID"
              value={props.roomKey}
              onChange={(e) => props.setRoomKey(e.target.value)}
              fullWidth
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            disabled={!props.roomKey || !props.isConnected}
            onClick={() => props.handleSubmit()}
          >
            <MeetingRoom/>
          </Button>
        </Box>
      </Box>
    </Box>
  </Container>
)

const StyledComponent = styled(Component)`
  
`

export default Home

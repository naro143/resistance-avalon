import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Container, Button, InputBase, Box } from '@material-ui/core'
import { MeetingRoom } from '@material-ui/icons'

type ContainerProps = {}

const Home = (props: ContainerProps) => {
  const router = useRouter()
  const [playerName, setPlayerName] = useState<string>('')

  const handleSubmit = async () => {
    console.log(location.href)
    await fetch(location.href + 'join-game', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerName,
      })
    }).then((response) => {
      if (response.ok) router.push('/players')
    }).catch((error) => {
      console.error(error)
    })
  }

  return (
    <StyledComponent
      {...props}
      playerName={playerName}
      setPlayerName={setPlayerName}
      handleSubmit={handleSubmit}
    />
  )
}

type Props = ContainerProps & {
  className?: string
  playerName: string
  setPlayerName: (value: string) => void
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
              placeholder="プレイヤー名を入力してください。"
              value={props.playerName}
              onChange={(e) => props.setPlayerName(e.target.value)}
              fullWidth
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            disabled={!props.playerName}
            onClick={() => props.handleSubmit()}
          >
            <MeetingRoom/>
          </Button>
        </Box>
      </Box>
    </Box>
  </Container>
)

const StyledComponent = styled(Component)``

export default Home

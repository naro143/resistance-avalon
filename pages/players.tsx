import React, { useState, useEffect } from 'react'
import { InferGetStaticPropsType } from 'next'
import styled from 'styled-components'
import io from 'socket.io-client'
import { Container, Box, Paper } from '@material-ui/core'

type ContainerProps = InferGetStaticPropsType<typeof getStaticProps>

type PlayerType = {
  name: string
}

type PlayersApiResponceType = {
  players: PlayerType[]
}

export const getStaticProps = async () => {
  const res = await fetch('http://localhost:3000/get-players')
  const res_json: PlayersApiResponceType = await res.json()
  const players: PlayerType[] = res_json.players

  return {
    props: {
      players,
    },
  }
}

const Players = (props: ContainerProps) => {
  const [socket, _] = useState(() => io())
  const [isConnected, setIsConnected] = useState(false)
  const [newPlayer, setNewPlayer] = useState<PlayerType>({
    name: '',
  })
  const [players, setPlayers] = useState<PlayerType[]>(props.players)

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected!!')
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('socket disconnected!!')
      setIsConnected(false)
    })
    socket.on('update-data', (newData: PlayerType) => {
      console.log('Get Updated Data', newData)
      setNewPlayer(newData)
    })

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    if (newPlayer.name) {
      setPlayers([ ...players, newPlayer])
    }
  }, [newPlayer])

  return (
    <StyledComponent
      {...props}
      isConnected={isConnected}
      players={players}
    />
  )
}

type Props = ContainerProps & {
  className?: string
  isConnected: boolean
  players: PlayerType[]
}

const Component = (props: Props) => (
  <Container maxWidth="sm" className={props.className}>
    <Box height="100vh" display="flex" flexDirection="column">
      <Box flexGrow={1} py={1} overflow="hidden" display="flex" flexDirection="column" justifyContent="center">
        <h1>Player List</h1>
        {props.players.map((player, index) => (
          <Paper key={index} variant="outlined">
            <Box display="flex" p={1}>
              <p>{player.name}</p>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  </Container>
)

const StyledComponent = styled(Component)``

export default Players

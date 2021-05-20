import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import next from 'next'
import socketio from "socket.io"

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

export class Player {
  constructor(public name: string) {}
}

app
  .prepare()
  .then(() => {
    const server = express()
    server.use(bodyParser())

    // global state
    const players: Player[] = [];

    server.post('/join-game', (req: Request, res: Response) => {
      console.log('body', req.body)
      const player: Player = players.find(player => player.name == req.body.playerName)

      if (player) res.sendStatus(400)

      const newPlayer: Player = new Player(req.body.playerName)
      players.push(newPlayer)
      postIO(newPlayer)
      res.sendStatus(200)
    })

    server.get('/get-players', (req: Request, res: Response) => {
      console.log('body', req.body)
      res.status(200).json({players: players})
    })

    server.all('*', async (req: Request, res: Response) => {
      return handle(req, res)
    })

    const httpServer = server.listen(port, (err?: any) => {
      if (err) throw err
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`)
    })

    const io = new socketio.Server(httpServer)

    io.on('connection', (socket: socketio.Socket) => {
      console.log('id: ' + socket.id + ' is connected')
    })

    const postIO = (data) => {
      io.emit('update-data', data)
    }
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })

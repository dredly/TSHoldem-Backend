import { WebSocket, WebSocketServer } from 'ws';
import { parseClientMessage } from './parsers';
import { isCreateGameMessage, isCreatePlayerMessage, isJoinGameMessage } from './typeGuards';
import { handleGameCreation, handlePlayerCreation, handleJoin } from './handlers';
import { ApplicationState } from './types';

const wss = new WebSocketServer({ port: 8080 })

const applicationState: ApplicationState = {
    players: [],
    games: []
}

// Maps playerIds to webSockets
const pubSubInfo = new Map<String, WebSocket>()

wss.on("connection", ws => {
    console.log("Someone connected")
    ws.on("message", data => {
        console.log("Received message from frontend")
        try {
            const obj = JSON.parse(data.toString())
            try {
                const clientMessage = parseClientMessage(obj)
                if (isCreatePlayerMessage(clientMessage)) {
                    handlePlayerCreation(clientMessage, applicationState, ws, pubSubInfo)
                }
                if (isCreateGameMessage(clientMessage)) {
                    handleGameCreation(clientMessage, applicationState, ws)
                }
                if (isJoinGameMessage(clientMessage)) {
                    handleJoin(clientMessage, applicationState, pubSubInfo)
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message)
                }
            }
        } catch (err) {
            console.log("parsing error", err)
        }  
    })
    ws.on("close", () => {
        console.log("Someone disconnected")
    })
})

wss.on("listening", () => {
    console.log("The WebSocket server is running on port 8080");
})


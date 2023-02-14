import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { parseClientMessage } from './parsers';
import { isClientMessage } from './typeGuards';

const server = createServer();
const wss = new WebSocketServer({ port: 8080 })

wss.on("connection", ws => {
    console.log("Someone connected")
    ws.on("message", data => {
        console.log("Received message from frontend")
        try {
            const obj = JSON.parse(data.toString())
            try {
                const clientMessage = parseClientMessage(obj)
                console.log("clientMessage", clientMessage)
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

console.log("The WebSocket server is running on port 8080");
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const server = createServer();
const wss = new WebSocketServer({ port: 8080 })

wss.on("connection", ws => {
    console.log("Someone connected")
    ws.on("message", data => {
        console.log("Received message from frontend")
        try {
            const obj = JSON.parse(data.toString())
            console.dir(obj)
        } catch (err) {
            console.log("parsing error", err)
        }
        
    })
    ws.on("close", () => {
        console.log("Someone disconnected")
    })
})

console.log("The WebSocket server is running on port 8080");
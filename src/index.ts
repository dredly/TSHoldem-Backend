import { WebSocket, WebSocketServer } from "ws";
import { parseClientMessage } from "./parsers";
import { handlePlayerCreation, handleGameCreation, handleJoin, handleStart } from "./server/handlers/gameManagementHandlers";
import { handleBet, handleFold } from "./server/handlers/gamePlayHandlers";
import { isBetMessage, isCreateGameMessage, isCreatePlayerMessage, isFoldMessage, isJoinGameMessage, isStartGameMessage } from "./typeGuards";
import { ApplicationState } from "./types";

const wss = new WebSocketServer({ port: 8080 });

const applicationState: ApplicationState = {
    players: [],
    games: []
};

// Maps playerIds to webSockets
const pubSubInfo = new Map<string, WebSocket>();

wss.on("connection", ws => {
    console.log("Someone connected");
    ws.on("message", data => {
        console.log("Received message from frontend");
        try {
            const obj: unknown = JSON.parse(data.toString());
            try {
                const clientMessage = parseClientMessage(obj);
                if (isCreatePlayerMessage(clientMessage)) {
                    handlePlayerCreation(clientMessage, applicationState, ws, pubSubInfo);
                }
                if (isCreateGameMessage(clientMessage)) {
                    handleGameCreation(clientMessage, applicationState, ws);
                }
                if (isJoinGameMessage(clientMessage)) {
                    handleJoin(clientMessage, applicationState, pubSubInfo);
                }
                if (isStartGameMessage(clientMessage)) {
                    handleStart(clientMessage, applicationState, pubSubInfo);
                }
                if (isBetMessage(clientMessage)) {
                    handleBet(clientMessage, applicationState, pubSubInfo);
                }
                if (isFoldMessage(clientMessage)) {
                    handleFold(clientMessage, applicationState, pubSubInfo);
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message);
                }
            }
        } catch (err) {
            console.log("parsing error", err);
        }  
    });
    ws.on("close", () => {
        console.log("Someone disconnected");
    });
});

wss.on("listening", () => {
    console.log("The WebSocket server is running on port 8080");
});


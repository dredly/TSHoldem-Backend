import { WebSocket } from "ws";
import { Player, ServerMessage } from "../types";

export const publishServerMessage = (message: ServerMessage, ws: WebSocket): void => {
    ws.send(JSON.stringify(message));
};

export const publishToPlayers = (message: ServerMessage, pubSubInfo: Map<string, WebSocket>, players: Player[]): void => {
    players.forEach(p => {
        const ws = pubSubInfo.get(p.id);
        if (!ws) {
            throw new Error("Could not find websocket for player");
        }
        ws.send(JSON.stringify(message));
    });
};
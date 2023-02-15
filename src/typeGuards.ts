import { ClientMessage, CreatePlayerMessage, CreateGameMessage, JoinGameMessage } from "./types";

export const isCreatePlayerMessage = (message: unknown): message is CreatePlayerMessage => {
    return (message as CreatePlayerMessage).name !== undefined
}

export const isJoinGameMessage = (message: unknown): message is JoinGameMessage => {
    return (message as JoinGameMessage).gameId !== undefined 
        && (message as JoinGameMessage).playerId !== undefined
}

export const isCreateGameMessage = (message: unknown): message is CreateGameMessage => {
    // JoinGameMessage also has the playerId property, so do extra check to avoid any clashes
    return !isJoinGameMessage(message) 
        && (message as CreateGameMessage).playerId !== undefined
}

export const isClientMessage = (obj: unknown): obj is ClientMessage => {
    return isCreatePlayerMessage(obj) || isCreateGameMessage(obj) || isJoinGameMessage(obj)
}
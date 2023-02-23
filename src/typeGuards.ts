import { ClientMessage, CreatePlayerMessage, CreateGameMessage, JoinGameMessage, StartGameMessage } from "./types";

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

export const isStartGameMessage = (message: unknown): message is StartGameMessage => {
    // JoinGameMessage also has the gameId property, so do extra check to avoid any clashes
    return !isJoinGameMessage(message) 
        && (message as StartGameMessage).gameId !== undefined
}

export const isClientMessage = (obj: unknown): obj is ClientMessage => {
    return isCreatePlayerMessage(obj) || isCreateGameMessage(obj) || isJoinGameMessage(obj) || isStartGameMessage(obj)
}
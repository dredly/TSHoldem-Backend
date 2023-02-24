import { ClientMessage, CreatePlayerMessage, CreateGameMessage, JoinGameMessage, StartGameMessage, BetMessage } from "./types";

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

export const isCreatePlayerMessage = (message: unknown): message is CreatePlayerMessage => {
    return (message as CreatePlayerMessage).name !== undefined && isString((message as CreatePlayerMessage).name)
}

export const isJoinGameMessage = (message: unknown): message is JoinGameMessage => {
    return (message as JoinGameMessage).gameId !== undefined && isString((message as JoinGameMessage).gameId)
        && (message as JoinGameMessage).playerId !== undefined && isString((message as JoinGameMessage).playerId)
}

export const isBetMessage = (message: unknown): message is BetMessage => {
    return (message as BetMessage).playerId !== undefined && isString((message as BetMessage).playerId)
        && (message as BetMessage).amount !== undefined && typeof (message as BetMessage).amount === "number"
}

export const isCreateGameMessage = (message: unknown): message is CreateGameMessage => {
    // JoinGameMessage also has the playerId property, so do extra check to avoid any clashes
    return !isJoinGameMessage(message) && !isBetMessage(message)
        && (message as CreateGameMessage).playerId !== undefined && isString((message as CreateGameMessage).playerId)
}

export const isStartGameMessage = (message: unknown): message is StartGameMessage => {
    // JoinGameMessage also has the gameId property, so do extra check to avoid any clashes
    return !isJoinGameMessage(message) && !isBetMessage(message)
        && (message as StartGameMessage).gameId !== undefined && isString((message as StartGameMessage).gameId)
}

export const isClientMessage = (obj: unknown): obj is ClientMessage => {
    return isCreatePlayerMessage(obj) 
        || isCreateGameMessage(obj) 
        || isJoinGameMessage(obj) 
        || isStartGameMessage(obj)
        || isBetMessage(obj)
}
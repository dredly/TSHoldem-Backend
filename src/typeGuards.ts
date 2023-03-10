import { ClientMessage, CreatePlayerMessage, CreateGameMessage, JoinGameMessage, StartGameMessage, BetMessage, FoldMessage } from "./types";

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

export const isCreatePlayerMessage = (message: unknown): message is CreatePlayerMessage => {
    return (message as CreatePlayerMessage).name !== undefined 
        && isString((message as CreatePlayerMessage).name)
}

export const isCreateGameMessage = (message: unknown): message is CreateGameMessage => {
    return (message as CreateGameMessage).creatorId !== undefined 
        && isString((message as CreateGameMessage).creatorId)
}

export const isJoinGameMessage = (message: unknown): message is JoinGameMessage => {
    return (message as JoinGameMessage).gameId !== undefined && isString((message as JoinGameMessage).gameId)
        && (message as JoinGameMessage).playerId !== undefined && isString((message as JoinGameMessage).playerId)
}

export const isStartGameMessage = (message: unknown): message is StartGameMessage => {
    return (message as StartGameMessage).startingGameId !== undefined 
        && isString((message as StartGameMessage).startingGameId)
}

export const isBetMessage = (message: unknown): message is BetMessage => {
    return (message as BetMessage).bettingPlayerId !== undefined && isString((message as BetMessage).bettingPlayerId)
        && (message as BetMessage).amount !== undefined && typeof (message as BetMessage).amount === "number"
}

export const isFoldMessage = (message: unknown): message is FoldMessage => {
    return (message as FoldMessage).foldingPlayerId !== undefined && isString((message as FoldMessage).foldingPlayerId)
}

export const isClientMessage = (obj: unknown): obj is ClientMessage => {
    return isCreatePlayerMessage(obj) 
        || isCreateGameMessage(obj) 
        || isJoinGameMessage(obj) 
        || isStartGameMessage(obj)
        || isBetMessage(obj)
        || isFoldMessage(obj)
}
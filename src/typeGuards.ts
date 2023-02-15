import { ClientMessage, CreatePlayerMessage, CreateGameMessage } from "./types";

export const isCreatePlayerMessage = (message: unknown): message is CreatePlayerMessage => {
    return (message as CreatePlayerMessage).name !== undefined
}

export const isCreateGameMessage = (message: unknown): message is CreateGameMessage => {
    return (message as CreateGameMessage).playerId !== undefined
}

export const isClientMessage = (obj: unknown): obj is ClientMessage => {
    return isCreatePlayerMessage(obj) || isCreateGameMessage(obj)
}
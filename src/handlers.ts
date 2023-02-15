import { debug } from "console"
import { createPlayer } from "./gameManagement"
import { CreateGameMessage, CreatePlayerMessage } from "./types"

export const handlePlayerCreation = (message: CreatePlayerMessage) => {
    console.log(debug, `Creating player with name ${message.name}`)
    const player = createPlayer(message.name)
}

export const handleGameCreation = (message: CreateGameMessage) => {
    console.log(`Player with id ${message.playerId} creating game`)
}
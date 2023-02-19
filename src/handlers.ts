import { debug } from "console"
import { WebSocket } from "ws"
import { createGame, createPlayer } from "./gameManagement"
import { ApplicationState, CreateGameMessage, CreatePlayerMessage, JoinGameMessage } from "./types"

export const handlePlayerCreation = (message: CreatePlayerMessage, applicationState: ApplicationState) => {
    console.log(debug, `Creating player with name ${message.name}`)
    const player = createPlayer(message.name)
    applicationState.players = applicationState.players.concat(player)
}

export const handleGameCreation = (message: CreateGameMessage, applicationState: ApplicationState) => {
    console.log(debug, `Player with id ${message.playerId} creating game`)
    const player = applicationState.players.find(p => p.id === message.playerId)
    if (!player) {
        throw new Error("player not found")
    }
    applicationState.players = applicationState.players.filter(p => p.id !== message.playerId)
    applicationState.games = applicationState.games.concat(createGame(player))
}

export const handleJoin = (message: JoinGameMessage, applicationState: ApplicationState) => {
    console.log(debug, `Player with id ${message.playerId} joining game with id ${message.gameId}`)

    const player = applicationState.players.find(p => p.id === message.playerId)
    if (!player) {
        throw new Error("player not found")
    }

    const game = applicationState.games.find(g => g.id === message.gameId)
    if (!game) {
        throw new Error("game not found")
    }

    applicationState.players = applicationState.players.filter(p => p.id !== message.playerId)
    applicationState.games = applicationState.games
        .map(g => g.id === message.gameId ? { ...g, players: g.players.concat(player) } : g)
}
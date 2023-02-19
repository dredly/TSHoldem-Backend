import { debug } from "console"
import { WebSocket } from "ws"
import { createGame, createPlayer } from "./gameManagement"
import { publishServerMessage, publishToPlayers } from "./server/publishing"
import { ApplicationState, CreateGameMessage, CreatePlayerMessage, GameCreatedMessage, GameJoinedMessage, JoinGameMessage, PlayerCreatedMessage } from "./types"

export const handlePlayerCreation = (message: CreatePlayerMessage, applicationState: ApplicationState, ws: WebSocket, pubSubInfo: Map<String, WebSocket>) => {
    console.log(debug, `Creating player with name ${message.name}`)
    const player = createPlayer(message.name)
    applicationState.players = applicationState.players.concat(player)
    
    pubSubInfo.set(player.id, ws)
    publishServerMessage({ player }, ws)
}

export const handleGameCreation = (message: CreateGameMessage, applicationState: ApplicationState, ws: WebSocket) => {
    console.log(debug, `Player with id ${message.playerId} creating game`)
    const player = applicationState.players.find(p => p.id === message.playerId)
    if (!player) {
        throw new Error("player not found")
    }
    const game = createGame(player)
    applicationState.players = applicationState.players.filter(p => p.id !== message.playerId)
    applicationState.games = applicationState.games.concat(game)
    
    publishServerMessage({ game }, ws)
}

export const handleJoin = (message: JoinGameMessage, applicationState: ApplicationState, pubSubInfo: Map<String, WebSocket>) => {
    console.log(debug, `Player with id ${message.playerId} joining game with id ${message.gameId}`)

    const player = applicationState.players.find(p => p.id === message.playerId)
    if (!player) {
        throw new Error("player not found")
    }

    const game = applicationState.games.find(g => g.id === message.gameId)
    if (!game) {
        throw new Error("game not found")
    }

    const gameJoined = { ...game, players: game.players.concat(player) }

    applicationState.players = applicationState.players.filter(p => p.id !== message.playerId)
    applicationState.games = applicationState.games
        .map(g => g.id === message.gameId ? gameJoined : g)

    publishToPlayers({ gameJoined }, pubSubInfo, gameJoined.players)
}
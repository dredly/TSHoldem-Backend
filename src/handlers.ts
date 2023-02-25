import { WebSocket } from "ws"
import { createGame, createPlayer, initialiseRoles } from "./gameManagement"
import { nextPlayerToBet, updateGameWithBet, updateGameWithFold } from "./gameplay/betting"
import { blindsRound, prepareForRound } from "./gameplay/roundManagement"
import { publishServerMessage, publishToPlayers } from "./server/publishing"
import { 
    ApplicationState, 
    BetMessage, 
    CreateGameMessage, 
    CreatePlayerMessage, 
    FoldMessage, 
    Game, 
    JoinGameMessage, 
    StartGameMessage 
} from "./types"

export const handlePlayerCreation = (message: CreatePlayerMessage, applicationState: ApplicationState, ws: WebSocket, pubSubInfo: Map<String, WebSocket>) => {
    console.debug(`Creating player with name ${message.name}`)
    const player = createPlayer(message.name)
    applicationState.players = applicationState.players.concat(player)
    
    pubSubInfo.set(player.id, ws)
    publishServerMessage({ player }, ws)
}

export const handleGameCreation = (message: CreateGameMessage, applicationState: ApplicationState, ws: WebSocket) => {
    console.debug(`Player with id ${message.creatorId} creating game`)
    const player = applicationState.players.find(p => p.id === message.creatorId)
    if (!player) {
        throw new Error("player not found")
    }
    const game = createGame(player)
    applicationState.players = applicationState.players.filter(p => p.id !== message.creatorId)
    applicationState.games = applicationState.games.concat(game)
    
    publishServerMessage({ game }, ws)
}

export const handleJoin = (message: JoinGameMessage, applicationState: ApplicationState, pubSubInfo: Map<String, WebSocket>) => {
    console.debug(`Player with id ${message.playerId} joining game with id ${message.gameId}`)

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

export const handleStart = (message: StartGameMessage, applicationState: ApplicationState, pubSubInfo: Map<String, WebSocket>) => {
    console.debug(`Starting game with id ${message.startingGameId}`)

    const game = applicationState.games.find(g => g.id === message.startingGameId)
    if (!game) {
        throw new Error("game not found")
    }

    const gameStarted = { 
        ...game, 
        players: initialiseRoles(game.players), 
        started: true
    }

    applicationState.games = applicationState.games
        .map(g => g.id === message.startingGameId ? gameStarted : g)

    publishToPlayers({ gameStarted }, pubSubInfo, gameStarted.players)

    const gameUpdated = blindsRound(prepareForRound(gameStarted))

    applicationState.games = applicationState.games
        .map(g => g.id === message.startingGameId ? gameUpdated : g)

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players)
}

export const handleBet = (message: BetMessage, applicationState: ApplicationState, pubSubInfo: Map<String, WebSocket>) => {
    console.debug(`Player with id ${message.bettingPlayerId} bet $${message.amount}`)

    const game = applicationState.games.find(g => g.players.map(p => p.id).includes(message.bettingPlayerId))
    if (!game) {
        throw new Error("game with that player not found")
    }

    const player = game.players.find(p => p.id === message.bettingPlayerId)
    if (!player) {
        throw new Error("player not found")
    }

    if (game.turnToBet !== player.id) {
        throw new Error("player betting out of turn")
    }

    const gameUpdatedWithBet = updateGameWithBet(game, player, message.amount)
    const turnToBet = nextPlayerToBet(gameUpdatedWithBet)
    if (!turnToBet) {
        // This means the round of betting is over
        throw new Error("FUNCTIONALITY NOT YET IMPLEMENTED")
    }
    const gameUpdated: Game = {
        ...gameUpdatedWithBet,
        turnToBet
    }

    applicationState.games = applicationState.games
        .map(g => g.id === game.id ? gameUpdated : g)

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players)
}

export const handleFold = (message: FoldMessage, applicationState: ApplicationState, pubSubInfo: Map<String, WebSocket>) => {
    console.debug(`Player with id ${message.foldingPlayerId} folding`)

    const game = applicationState.games.find(g => g.players.map(p => p.id).includes(message.foldingPlayerId))
    if (!game) {
        throw new Error("game with that player not found")
    }

    const player = game.players.find(p => p.id === message.foldingPlayerId)
    if (!player) {
        throw new Error("player not found")
    }

    if (game.turnToBet !== player.id) {
        throw new Error("player betting out of turn")
    }

    const gameUpdatedWithFold = updateGameWithFold(game, player)
    const turnToBet = nextPlayerToBet(gameUpdatedWithFold)
    if (!turnToBet) {
        // This means the round of betting is over
        throw new Error("FUNCTIONALITY NOT YET IMPLEMENTED")
    }

    const gameUpdated: Game = {
        ...gameUpdatedWithFold,
        turnToBet
    }

    applicationState.games = applicationState.games
        .map(g => g.id === game.id ? gameUpdated : g)

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players)
}
import WebSocket from "ws"
import { updateGameWithBet, nextPlayerToBet, updateGameWithFold } from "../../gameplay/betting"
import { BetMessage, ApplicationState, Game, FoldMessage } from "../../types"
import { publishToPlayers } from "../publishing"

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
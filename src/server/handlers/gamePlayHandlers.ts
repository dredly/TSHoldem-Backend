import WebSocket from "ws"
import { updateGameWithBet, updateGameWithFold, updateGameWithNextBet } from "../../gameplay/betting"
import { BetMessage, ApplicationState, Game, FoldMessage } from "../../types"
import { publishToPlayers } from "../publishing"
import { handleDealing } from "./internalHandlers"

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

    const gameUpdated = updateGameWithNextBet(gameUpdatedWithBet)

    if (gameUpdated.bettingInfo?.round !== game.bettingInfo?.round) {
        console.debug("moving on to next round")
        handleDealing(game, applicationState, pubSubInfo)
        return
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
    const gameUpdated = updateGameWithNextBet(gameUpdatedWithFold)

    if (gameUpdated.bettingInfo?.round !== game.bettingInfo?.round) {
        console.debug("moving on to next round")
        handleDealing(game, applicationState, pubSubInfo)
        return
    }

    applicationState.games = applicationState.games
        .map(g => g.id === game.id ? gameUpdated : g)

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players)
}
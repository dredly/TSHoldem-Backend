import shuffle from "lodash.shuffle";
import { gameConfig } from "../gameConfig";
import { Card, Game, Player } from "../types";
import { getBettingOrder, updateGameWithBet } from "./betting";
import { makeDeckDefault } from "./cards/cardUtils";
import { dealRound } from "./cards/dealing";
import { compareHands } from "./cards/handComparison";

export const switchRoles = (players: Player[]): Player[] => {
    return players
        .map((p, idx, arr) => {
            if (idx > 0) {
                return { ...p, role: arr[idx - 1].role }
            }
            return { ...p, role: arr[arr.length - 1].role }
        })
}

export const sortPlayersByScore = (players: Player[], cardsOnTable: Card[]): Player[] => {
    return [ ...players ]
        .sort((p1, p2) => -compareHands(p1.cards.concat(cardsOnTable), p2.cards.concat(cardsOnTable)))
}

export const getWinners = (game: Game): Player[] => {
    const sortedByScore = sortPlayersByScore(game.players, game.cardsOnTable)
    for (let i = 0; i < sortedByScore.length; i++) {
        const player = sortedByScore[i]
        if (i === sortedByScore.length - 1) {
            return sortedByScore
        }
        const nextPlayer = sortedByScore[i + 1]
        if (compareHands(player.cards.concat(game.cardsOnTable), nextPlayer.cards.concat(game.cardsOnTable))) {
            return sortedByScore.slice(0, i + 1)
        }
    }
    return sortedByScore
}

export const prepareForRound = (game: Game): Game => {
    return {
        ...game, 
        deck: shuffle(game.deck),
        players: getBettingOrder(game.players)
    }
}

export const blindsRound = (game: Game): Game => {
    // for now dont worry about increasing the blinds
    const [ smallBlindAmount, bigBlindAmount ] = [Math.floor(gameConfig.startingBlind * 0.5), gameConfig.startingBlind]
    const gameAfterDealing = dealRound(game)
    // Assume the player are in order small blind, big blind, rest
    const gameAfterSmallBlind = updateGameWithBet(gameAfterDealing, gameAfterDealing.players[0], smallBlindAmount)
    const gameAfterBigBlind = updateGameWithBet(gameAfterSmallBlind, gameAfterSmallBlind.players[1], bigBlindAmount)
    return gameAfterBigBlind
}

export const resetAfterRound = (game: Game): Game => {
    return {
        ...game,
        pot: 0,
        betAmount: 0,
        deck: makeDeckDefault(),
        cardsOnTable: [],
        players: switchRoles(game.players.map(p => ( { ...p, cards: [] } ))) 
    }
}
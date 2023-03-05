import shuffle from "lodash.shuffle";
import { gameConfig } from "../gameConfig";
import { Card, Game, Player } from "../types";
import { getBettingOrder, updateGameWithBet } from "./betting";
import { makeDeckDefault } from "./cards/cardUtils";
import { dealRound } from "./cards/dealing";
import { compareHands } from "./cards/handComparison";
import { allHandCheckers, findBestHand } from "./cards/handEvaluation";

export const switchRoles = (players: Player[]): Player[] => {
    return players
        .map((p, idx, arr) => {
            if (idx > 0) {
                return { ...p, role: arr[idx - 1].role }
            }
            return { ...p, role: arr[arr.length - 1].role }
        })
}

export const groupPlayersByScore = (players: Player[], cardsOnTable: Card[]): Player[][] => {
    const result: Map<String, Player[]> = new Map()
    for (const player of players) {
        const score = findBestHand(player.cards.concat(cardsOnTable), allHandCheckers)
        const existingGroup = result.get(JSON.stringify(score))
        if (existingGroup) {
            result.set(JSON.stringify(score), existingGroup.concat(player))
        } else {
            result.set(JSON.stringify(score), [player])
        }
    }
    return [ ...result.values() ]
        .sort((g1, g2) => -compareHands(g1[0].cards.concat(cardsOnTable), g2[0].cards.concat(cardsOnTable)))
}

export const getWinners = (game: Game): Player[] => {
    // For now just worry about getting the first group of winners as we arent doing all ins / partial pots yet
    // probably need to filter out inactive players too in the future
    const groupedByScore = groupPlayersByScore(game.players, game.cardsOnTable)
    return groupedByScore[0]
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
    return {
        ...gameAfterBigBlind,
        turnToBet: gameAfterBigBlind.players[0].id,
        bettingInfo: {
            round: "BLINDS",
            isSecondPass: false
        }
    } 
}

export const resetAfterRound = (game: Game): Game => {
    return {
        ...game,
        pot: 0,
        betAmount: 0,
        deck: makeDeckDefault(),
        cardsOnTable: [],
        players: switchRoles(game.players.map(p => ( { ...p, cards: [] } ))),
        bettingInfo: undefined 
    }
}
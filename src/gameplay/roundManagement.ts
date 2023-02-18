import { Card, Game, Player } from "../types";
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
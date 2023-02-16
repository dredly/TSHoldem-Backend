import { Card, Suit } from "../types"

export const rankNameMapping = new Map<number, String>([
    [0, "Two"],
    [1, "Three"],
    [2, "Four"],
    [3, "Five"],
    [4, "Six"],
    [5, "Seven"],
    [6, "Eight"],
    [7, "Nine"],
    [8, "Ten"],
    [9, "Jack"],
    [10, "Queen"],
    [11, "King"],
    [12, "Ace"],
])

export const getRankName = (rank: number, mapping: Map<number, String>): String => {
    const rankName = mapping.get(rank)
    if (!rankName) throw new Error("No name for that rank")
    return rankName
}

export const getCardName = (card: Card, mapping: Map<number, String>): String => {
    return getRankName(card.rank, mapping) + " of " + card.suit.substring(0, 1) + card.suit.substring(1).toLowerCase()
}

export const makeDeck = (ranks: number[], suits: Suit[]): Card[] => {
    return ranks.flatMap(rank => suits.map(suit => ({ rank, suit })))
}

export const countCardsOfRank = (rank: number, cards: Card[]): number => {
    return cards.filter(c => c.rank === rank).length
}

export const findPotentialGroup = (cards: Card[], groupSize: number): number | undefined => {
    // If group(s) found, return the rank of the highest ranking group, otherwise return undefined
    return [ ...cards.map(c => c.rank) ]
        .sort((r1, r2) => r2 - r1)
        .find(r => countCardsOfRank(r, cards) === groupSize)
}
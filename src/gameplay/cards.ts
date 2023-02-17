import { Card, HandChecker, HandEvaluation, Suit } from "../types"
import every from "lodash.every";

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

export const countCardsOfSuit = (suit: Suit, cards: Card[]): number => {
    return cards.filter(c => c.suit === suit).length
}

export const findPotentialGroup = (cards: Card[], groupSize: number): number | undefined => {
    // If group(s) found, return the rank of the highest ranking group, otherwise return undefined
    return [ ...cards.map(c => c.rank) ]
        .sort((r1, r2) => r2 - r1)
        .find(r => countCardsOfRank(r, cards) === groupSize)
}

export const findPotentialFlush: HandChecker = (cards: Card[]): number | undefined => {
    const numForFlush = 5
    return [ ...cards ]
        .sort((c1, c2) => c2.rank - c1.rank)
        .find(c => countCardsOfSuit(c.suit, cards) >= numForFlush)?.rank
}

export const findPotentialFullHouse: HandChecker = (cards: Card[]): number | undefined => {
    const threeOfAKindRank = findPotentialGroup(cards, 3)
    if (threeOfAKindRank) {
        const remainingCards = cards.filter(c => c.rank !== threeOfAKindRank)
        // there could potentially be a second group of 3, but we would still just take 2 from it and consider it a full house
        const pairRank = findPotentialGroup(remainingCards, 2) || findPotentialGroup(remainingCards, 3)
        if (pairRank) {
            // this ensures that the pairRank will only matter in comparisons when threeOfAKindRank is equal
            return threeOfAKindRank + pairRank * 0.01
        }
    }
}

export const findPotentialTwoPairs: HandChecker = (cards: Card[]): number | undefined => {
    const firstPairRank = findPotentialGroup(cards, 2)
    if (firstPairRank) {
        const remainingCards = cards.filter(c => c.rank !== firstPairRank)
        const secondPairRank = findPotentialGroup(remainingCards, 2)
        if (secondPairRank) {
            // Because of the sorting done in findPotentialGroup, firstPairRank should alway be higher
            // Also should not need to worry about accidentally getting a 4 of a kind here, as that check will be done first
            return firstPairRank + secondPairRank * 0.01
        }
    }
}

export const findPotentialStraight: HandChecker = (cards: Card[]): number | undefined => {
    const highestToLowestRank = [ ...cards.map(c => c.rank) ].sort((r1, r2) => r2 - r1)
    for (const rank of highestToLowestRank) {
        // --- rank === 3 ? 12 : rank - 4 --- Special case for straight with low ace
        const fourBelow = [rank - 1, rank - 2, rank - 3, rank === 3 ? 12 : rank - 4]
        if (every(fourBelow, r => highestToLowestRank.includes(r))) return rank
    }
}

export const findPotentialStraightFlush: HandChecker = (cards: Card[]): number | undefined => {
    const highestToLowest = [ ...cards ].sort((c1, c2) => c2.rank - c1.rank)
    for (const card of highestToLowest) {
        const potentialStraightRanks = [
            card.rank,
            card.rank - 1,
            card.rank - 2,
            card.rank - 3,
            card.rank === 3 ? 12 : card.rank - 4
        ]
        // Make sure we only look for a flush in a sequence of cards
        if (every(potentialStraightRanks, r => highestToLowest.find(c => c.rank === r))) {
            const sequentialCards = highestToLowest.filter(c => potentialStraightRanks.includes(c.rank))
            return findPotentialFlush(sequentialCards)
        }
    }
}

export const findHighCard: HandChecker = (cards: Card[]): number => {
    return Math.max(...cards.map(c => c.rank))
}

export const findBestHand = (cards: Card[], handCheckers: HandChecker[]): HandEvaluation => {
    const succesfulChecker = handCheckers.find(hc => hc(cards))
    if (!succesfulChecker) {
        throw new Error("Error evaluating hand")
    }
    const handValue = succesfulChecker(cards) as number
    return {
        handRank: handCheckers.indexOf(succesfulChecker),
        handValue
    }
}

export const compareHandEvaluations = (evaluation1: HandEvaluation, evaluation2: HandEvaluation): number => {
    if (evaluation1.handRank === evaluation2.handRank) {
        if (evaluation1.handValue === evaluation2.handValue) {
            return 0
        }
        return evaluation1.handValue > evaluation2.handValue ? 1 : -1
    }
    return evaluation1.handRank < evaluation2.handRank ? 1 : -1
}

export const getLeftoversFromValue = (cards: Card[], handValue: number): Card[] => {
    return cards.filter(c => c.rank !== handValue)
}

export const getLeftoversFromCompondValue = (cards: Card[], handValue: number): Card[] => {
    const majorValue = Math.floor(handValue)
    const minorValue = Math.floor((handValue - Math.floor(handValue)) * 100) 
    return cards.filter(c => ![majorValue, minorValue].includes(c.rank))
}

export const compareHands = (hand1: Card[], hand2: Card[]): number => {
    // NOT IMPLEMENTED
    return 2
}
import every from "lodash.every"
import { Card, HandChecker, HandEvaluation } from "../../types"
import { countCardsOfRank, countCardsOfSuit } from "./cardUtils"

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

export const allHandCheckers = [
    findPotentialStraightFlush,
    (cards: Card[] ) => findPotentialGroup(cards, 4),
    findPotentialFullHouse,
    findPotentialFlush,
    findPotentialStraight,
    (cards: Card[] ) => findPotentialGroup(cards, 3),
    findPotentialTwoPairs,
    (cards: Card[] ) => findPotentialGroup(cards, 2),
    findHighCard   
]

export const indicesWithoutLeftovers = [0, 2, 3, 4]
export const fourOfAKindIndex = 1
export const twoPairsIndex = 6
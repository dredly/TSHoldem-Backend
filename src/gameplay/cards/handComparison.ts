import { HandEvaluation, Card } from "../../types"
import { findBestHand, findHighCard } from "./handEvaluation"

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

export const compareByHighCards = (hand1: Card[], hand2: Card[]): number => {
    // Generally would expect length of the hands to be same, so optimise by only checking length of hand1
    if (!hand1.length) {
        return 0
    }
    const evaluations = [hand1, hand2].map(h => findBestHand(h, [findHighCard]))
    const comparisonResult = compareHandEvaluations(evaluations[0], evaluations[1])
    if (comparisonResult) {
        return comparisonResult
    }
    // Here we expect handEvaluations to have the same handValue
    const handValue = evaluations[0].handValue
    return compareByHighCards(getLeftoversFromValue(hand1, handValue), getLeftoversFromValue(hand2, handValue))
}

export const compareHands = (hand1: Card[], hand2: Card[]): number => {
    // NOT IMPLEMENTED
    return 2
}
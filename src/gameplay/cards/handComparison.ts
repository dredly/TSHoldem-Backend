import { HandEvaluation, Card } from "../../types"
import { allHandCheckers, findBestHand, findHighCard, fourOfAKindIndex, indicesWithoutLeftovers, twoPairsIndex } from "./handEvaluation"

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
    const evaluations = [hand1, hand2].map(h => findBestHand(h, allHandCheckers))
    const initialComparisonResult = compareHandEvaluations(evaluations[0], evaluations[1])
    if (initialComparisonResult) {
        return initialComparisonResult
    }
    // This basically checks if the hand type which is tied is 5 cards. In this case it is a tie as we dont consider
    // any high cards afterwards
    const tiedRank = evaluations[0].handRank
    if (indicesWithoutLeftovers.includes(tiedRank)) {
        return 0
    }

    const leftovers = tiedRank === twoPairsIndex 
        ? [getLeftoversFromCompondValue(hand1, evaluations[0].handValue), getLeftoversFromCompondValue(hand2, evaluations[1].handValue)]
        : [getLeftoversFromValue(hand1, evaluations[0].handValue), getLeftoversFromValue(hand2, evaluations[1].handValue)]
    const sizeOfHandTaken = hand1.length - leftovers[0].length

    // Search for high cards in the remaining cards which make up a hand of 5 cards
    const lengthOfLeftoversToConsider = 5 - sizeOfHandTaken

    const [remainingCards1, remainingCards2] = leftovers
        .map(leftover => (
                [ ...leftover ]
                    .sort((c1, c2) => c2.rank - c1.rank)
                    .slice(0, lengthOfLeftoversToConsider)
            )
        )
        
    return compareByHighCards(remainingCards1, remainingCards2)
}
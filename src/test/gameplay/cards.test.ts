import { 
    compareByHighCards,
    compareHandEvaluations, 
    findBestHand, 
    findHighCard, 
    findPotentialFlush, 
    findPotentialFullHouse, 
    findPotentialGroup, 
    findPotentialStraight, 
    findPotentialStraightFlush, 
    findPotentialTwoPairs, 
    getCardName, 
    getLeftoversFromCompondValue, 
    getLeftoversFromValue, 
    makeDeck, 
    rankNameMapping 
} from "../../gameplay/cards"
import { Card, HandChecker, HandEvaluation } from "../../types"

describe("getCardName function", () => {
    it("returns the expected name of a valid card", () => {
        const card: Card = {
            rank: 6,
            suit: "CLUBS"
        }
        expect(getCardName(card, rankNameMapping)).toBe("Eight of Clubs")
    })

    it("throws an error for a card with an invalid rank", () => {
        const card: Card = {
            rank: 230,
            suit: "SPADES"
        }
        expect(() => { getCardName(card, rankNameMapping) }).toThrowError("No name for that rank")
    })
})

describe("makeDeck function", () => {
    it("generates a deck as expected", () => {
        const expectedDeck: Card[] = [
            { rank: 0, suit: "DIAMONDS" },
            { rank: 0, suit: "HEARTS" },
            { rank: 1, suit: "DIAMONDS" },
            { rank: 1, suit: "HEARTS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
        ]
        expect(makeDeck([0, 1, 2], ["DIAMONDS", "HEARTS"])).toEqual(expectedDeck)
    })
})

describe("findPotentialGroup function", () => {
    it("can find a single pair", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" }
        ]
        expect(findPotentialGroup(cards, 2)).toBe(2)
    })

    it("returns undefined when no group found", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS"}
        ]
        expect(findPotentialGroup(cards, 3)).toBeUndefined()
    })

    it("returns the rank of the higher group when multiple groups found", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 3, suit: "SPADES" }
        ]
        expect(findPotentialGroup(cards, 2)).toBe(3)
    })
})

describe("findPotentialFlush function", () => {
    it("finds a single flush and returns the rank of the highest card in that flush", () => {
        const cards: Card[] = [
            { rank: 2, suit: "SPADES" },
            { rank: 3, suit: "SPADES" },
            { rank: 5, suit: "SPADES" },
            { rank: 0, suit: "CLUBS" },
            { rank: 6, suit: "SPADES" },
            { rank: 8, suit: "SPADES" }
        ]
        expect(findPotentialFlush(cards)).toBe(8)
    })

    it("returns undefined when no flush found", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 3, suit: "SPADES" }
        ]
        expect(findPotentialFlush(cards)).toBeUndefined()
    })

    it("finds the rank of the highest possible flush when there are more than 5 of a suit", () => {
        const cards: Card[] = [
            { rank: 2, suit: "SPADES" },
            { rank: 3, suit: "SPADES" },
            { rank: 5, suit: "SPADES" },
            { rank: 0, suit: "CLUBS" },
            { rank: 6, suit: "SPADES" },
            { rank: 8, suit: "SPADES" },
            { rank: 10, suit: "SPADES" },
        ]
        expect(findPotentialFlush(cards)).toBe(10)
    })
})

describe("findPotentialFullHouse function", () => {
    it("finds a full house and returns the expected rank", () => {
        const cards: Card[] = [
            { rank: 4, suit: "SPADES" },
            { rank: 4, suit: "HEARTS" },
            { rank: 2, suit: "SPADES" },
            { rank: 2, suit: "CLUBS" },
            { rank: 6, suit: "SPADES" },
            { rank: 4, suit: "DIAMONDS" },
        ]
        expect(findPotentialFullHouse(cards)).toBe(4.02)
    })

    it("still finds a full house when there are 2 groups of 3", () => {
        const cards: Card[] = [
            { rank: 4, suit: "SPADES" },
            { rank: 4, suit: "HEARTS" },
            { rank: 2, suit: "SPADES" },
            { rank: 2, suit: "CLUBS" },
            { rank: 6, suit: "SPADES" },
            { rank: 4, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
        ]
        expect(findPotentialFullHouse(cards)).toBe(4.02)
    })

    it("returns undefined when no full house found", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" }
        ]
        expect(findPotentialFullHouse(cards)).toBeUndefined()
    })
})

describe("findPotentialTwoPairs function", () => {
    it("finds two pairs and returns the rank as expected", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 3, suit: "CLUBS" }
        ]
        expect(findPotentialTwoPairs(cards)).toBe(3.02)
    })

    it("returns undefined when only one pair found", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" }
        ]
        expect(findPotentialTwoPairs(cards)).toBeUndefined()
    })

    it("returns undefined when no pairs found", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
        ]
        expect(findPotentialTwoPairs(cards)).toBeUndefined()
    })
})

describe("findPotentialStraight function", () => {
    it("finds a straight and returns the rank of the highest card", () => {
        const cards: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 5, suit: "CLUBS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 10, suit: "CLUBS" },
            { rank: 6, suit: "CLUBS" }
        ]
        expect(findPotentialStraight(cards)).toBe(6)
    })

    it("finds a straight and returns the rank of the highest card when straight longer than 5", () => {
        const cards: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 7, suit: "SPADES" },
            { rank: 3, suit: "HEARTS" },
            { rank: 5, suit: "CLUBS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 10, suit: "CLUBS" },
            { rank: 6, suit: "CLUBS" }
        ]
        expect(findPotentialStraight(cards)).toBe(7)
    })

    it("returns undefined when no straight found", () => {
        const cards: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 5, suit: "CLUBS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 10, suit: "CLUBS" },
        ]
        expect(findPotentialStraight(cards)).toBeUndefined()
    })

    it("detects a straight where the ace is low", () => {
        const cards: Card[] = [
            { rank: 0, suit: "CLUBS" },
            { rank: 1, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 3, suit: "CLUBS" },
            { rank: 12, suit: "DIAMONDS" },
            { rank: 10, suit: "CLUBS" },
        ]
        expect(findPotentialStraight(cards)).toBe(3)
    })

    it("otherwise does not allow wraparound straights", () => {
        const cards: Card[] = [
            { rank: 0, suit: "CLUBS" },
            { rank: 1, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 11, suit: "CLUBS" },
            { rank: 12, suit: "DIAMONDS" },
            { rank: 10, suit: "CLUBS" },
        ]
        expect(findPotentialStraight(cards)).toBeUndefined()
    })
})

describe("findPotentialStraighFlush function", () => {
    it("returns the rank of the highest card present in the straight of the straight flush", () => {
        const cards: Card[] = [
            { rank: 0, suit: "CLUBS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "CLUBS" },
            { rank: 4, suit: "CLUBS" },
            { rank: 10, suit: "CLUBS" },
        ]
        expect(findPotentialStraightFlush(cards)).toBe(4)
    })

    it("returns undefined when there is a straight and a flush but not a straight flush", () => {
        const cards: Card[] = [
            { rank: 0, suit: "CLUBS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 3, suit: "CLUBS" },
            { rank: 4, suit: "CLUBS" },
            { rank: 8, suit: "CLUBS" },
        ]
        expect(findPotentialStraightFlush(cards)).toBeUndefined()
    })

    it("returns undefined when there is a straight but no flush", () => {
        const cards: Card[] = [
            { rank: 0, suit: "CLUBS" },
            { rank: 1, suit: "HEARTS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 3, suit: "CLUBS" },
            { rank: 4, suit: "CLUBS" },
        ]
        expect(findPotentialStraightFlush(cards)).toBeUndefined()
    })

    it("returns undefined when there is a flush but no straight", () => {
        const cards: Card[] = [
            { rank: 0, suit: "CLUBS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 5, suit: "CLUBS" },
            { rank: 8, suit: "CLUBS" },
            { rank: 11, suit: "CLUBS" }
        ]
        expect(findPotentialStraightFlush(cards)).toBeUndefined()
    })

    it("returns undefined when there is neither a flush nor a straight", () => {
        const cards: Card[] = [
            { rank: 4, suit: "CLUBS" }
        ]
        expect(findPotentialStraightFlush(cards)).toBeUndefined()
    })
})

describe("findHighCard function", () => {
    it("returns the rank of the highest card present", () => {
        const cards: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 5, suit: "CLUBS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 10, suit: "CLUBS" },
        ]
        expect(findHighCard(cards)).toBe(10)
    })
})

describe("findBestHand function", () => {
    const handCheckers: HandChecker[] = [
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
    it("finds a high card", () => {
        const cards: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
        ]
        const expectedEvaluation: HandEvaluation = {
            handRank: 8,
            handValue: 7
        }
        expect(findBestHand(cards, handCheckers)).toEqual(expectedEvaluation)
    })

    it("finds a pair", () => {
        const cards: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 3, suit: "SPADES" },
        ]
        const expectedEvaluation: HandEvaluation = {
            handRank: 7,
            handValue: 3
        }
        expect(findBestHand(cards, handCheckers)).toEqual(expectedEvaluation)
    })

    it("finds 2 pairs", () => {
        const cards: Card[] = [
            { rank: 7, suit: "HEARTS" },
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 3, suit: "SPADES" },
        ]
        const expectedEvaluation: HandEvaluation = {
            handRank: 6,
            handValue: 7.03
        }
        expect(findBestHand(cards, handCheckers)).toEqual(expectedEvaluation)
    })

    it("finds 3 of a kind", () => {
        const cards: Card[] = [
            { rank: 7, suit: "HEARTS" },
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 7, suit: "SPADES" },
        ]
        const expectedEvaluation: HandEvaluation = {
            handRank: 5,
            handValue: 7
        }
        expect(findBestHand(cards, handCheckers)).toEqual(expectedEvaluation)
    })

    it("finds straight", () => {
        const cards: Card[] = [
            { rank: 7, suit: "HEARTS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 4, suit: "CLUBS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 5, suit: "HEARTS" },
            { rank: 6, suit: "SPADES" },
        ]
        const expectedEvaluation: HandEvaluation = {
            handRank: 4,
            handValue: 7
        }
        expect(findBestHand(cards, handCheckers)).toEqual(expectedEvaluation)
    })

    it("finds flush", () => {
        const cards: Card[] = [
            { rank: 2, suit: "SPADES" },
            { rank: 3, suit: "SPADES" },
            { rank: 5, suit: "SPADES" },
            { rank: 0, suit: "CLUBS" },
            { rank: 6, suit: "SPADES" },
            { rank: 8, suit: "SPADES" },
            { rank: 10, suit: "SPADES" },
        ]
        const expectedEvaluation: HandEvaluation = {
            handRank: 3,
            handValue: 10
        }
        expect(findBestHand(cards, handCheckers)).toEqual(expectedEvaluation)
    })

    it("finds full house", () => {
        const cards: Card[] = [
            { rank: 4, suit: "SPADES" },
            { rank: 4, suit: "HEARTS" },
            { rank: 2, suit: "SPADES" },
            { rank: 2, suit: "CLUBS" },
            { rank: 6, suit: "SPADES" },
            { rank: 4, suit: "DIAMONDS" },
        ]
        const expectedEvaluation: HandEvaluation = {
            handRank: 2,
            handValue: 4.02
        }
        expect(findBestHand(cards, handCheckers)).toEqual(expectedEvaluation)
    })

    it("finds 4 of a kind", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 2, suit: "SPADES" }
        ]
        const expectedEvaluation: HandEvaluation = {
            handRank: 1,
            handValue: 2
        }
        expect(findBestHand(cards, handCheckers)).toEqual(expectedEvaluation)
    })

    it("finds straight flush", () => {
        const cards: Card[] = [
            { rank: 0, suit: "CLUBS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "CLUBS" },
            { rank: 4, suit: "CLUBS" },
            { rank: 10, suit: "CLUBS" },
        ]
        const expectedEvaluation: HandEvaluation = {
            handRank: 0,
            handValue: 4
        }
        expect(findBestHand(cards, handCheckers)).toEqual(expectedEvaluation)
    })
})

describe("compareHandEvaluations function", () => {
    it("returns 1 when the first evaluation is 'better' based on handRank", () => {
        const evaluations: HandEvaluation[] = [
            { handRank: 3, handValue: 4 },
            { handRank: 5, handValue: 6 } 
        ]
        expect(compareHandEvaluations(evaluations[0], evaluations[1])).toBe(1) 
    })

    it("returns -1 when the first evaluation is 'worse' based on handValue", () => {
        const evaluations: HandEvaluation[] = [
            { handRank: 3, handValue: 4 },
            { handRank: 3, handValue: 6 } 
        ]
        expect(compareHandEvaluations(evaluations[0], evaluations[1])).toBe(-1) 
    })

    it("returns 0 when the evaluations are the same", () => {
        const evaluations: HandEvaluation[] = [
            { handRank: 3, handValue: 4 },
            { handRank: 3, handValue: 4 } 
        ]
        expect(compareHandEvaluations(evaluations[0], evaluations[1])).toBe(0) 
    })
})

describe("getLeftoversFromValue function", () => {
    it("returns the expected leftover cards for 3 of a kind", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 9, suit: "SPADES" }
        ]
        const expectedLeftovers: Card[] = [
            { rank: 1, suit: "CLUBS" },
            { rank: 9, suit: "SPADES" }
        ]
        expect(getLeftoversFromValue(cards, 2)).toEqual(expectedLeftovers)
    })

    it("returns the expected leftover cards for a high card", () => {
        const cards: Card[] = [
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 9, suit: "SPADES" }
        ]
        const expectedLeftovers: Card[] = [
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
        ]
        expect(getLeftoversFromValue(cards, 9)).toEqual(expectedLeftovers)
    })
})

describe("getLeftoversFromCompoundValue function", () => {
    it("returns the expected leftover cards for 2 pairs", () => {
        const cards: Card[] = [
            { rank: 7, suit: "HEARTS" },
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 3, suit: "SPADES" },
        ]
        const expectedLeftovers: Card[] = [
            { rank: 4, suit: "CLUBS" }
        ]
        expect(getLeftoversFromCompondValue(cards, 7.03)).toEqual(expectedLeftovers)
    })
})

describe("compareByHighCards function", () => {
    it("returns 0 when both hands have same high cards", () => {
        const hand1: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
        ]
        const hand2: Card[] = [
            { rank: 4, suit: "HEARTS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "SPADES" },
        ]
        expect(compareByHighCards(hand1, hand2)).toBe(0)
    })

    it("works when highest card is different", () => {
        const hand1: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
        ]
        const hand2: Card[] = [
            { rank: 4, suit: "HEARTS" },
            { rank: 8, suit: "DIAMONDS" },
            { rank: 3, suit: "SPADES" },
        ]
        expect(compareByHighCards(hand1, hand2)).toBe(-1)
    })

    it("works when lowest card is different", () => {
        const hand1: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
        ]
        const hand2: Card[] = [
            { rank: 4, suit: "HEARTS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 2, suit: "SPADES" },
        ]
        expect(compareByHighCards(hand1, hand2)).toBe(1)
    })
})
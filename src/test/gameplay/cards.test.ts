import { findPotentialFlush, findPotentialFullHouse, findPotentialGroup, findPotentialStraight, findPotentialTwoPairs, getCardName, makeDeck, rankNameMapping } from "../../gameplay/cards"
import { Card } from "../../types"

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
        expect(findPotentialGroup(cards, 3)).toBeUndefined
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
        expect(findPotentialFlush(cards)).toBeUndefined
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
        expect(findPotentialFullHouse(cards)).toBeUndefined
    })
})

describe("findPotentialTwoPairs function", () => {
    it("finds two pairs and returns the rank of the higher pair", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 3, suit: "CLUBS" }
        ]
        expect(findPotentialTwoPairs(cards)).toBe(3)
    })

    it("returns undefined when only one pair found", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" }
        ]
        expect(findPotentialTwoPairs(cards)).toBeUndefined
    })

    it("returns undefined when no pairs found", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "DIAMONDS" },
        ]
        expect(findPotentialTwoPairs(cards)).toBeUndefined
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
        expect(findPotentialStraight(cards)).toBeUndefined
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
        expect(findPotentialStraight(cards)).toBeUndefined
    })
})
import { findPotentialGroup, getCardName, makeDeck, rankNameMapping } from "../../gameplay/cards"
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

describe("findPotentialGroup fucntion", () => {
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
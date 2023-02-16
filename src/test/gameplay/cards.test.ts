import { getCardName, rankNameMapping } from "../../gameplay/cards"
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
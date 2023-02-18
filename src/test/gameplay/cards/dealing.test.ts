import { createPlayer } from "../../../gameManagement"
import { dealRound } from "../../../gameplay/cards/dealing"
import { Game } from "../../../types"

describe("dealRound function", () => {
    it("should deal cards to players as expected", () => {
        const game: Game = {
            id: "1",
            pot: 322,
            deck: [
                { rank: 4, suit: "CLUBS" },
                { rank: 3, suit: "SPADES"},
                { rank: 5, suit: "CLUBS" },
                { rank: 8, suit: "SPADES"},
                { rank: 9, suit: "CLUBS" },
                { rank: 10, suit: "SPADES"},
                { rank: 7, suit: "CLUBS" },
                { rank: 1, suit: "SPADES"},
            ],
            cardsOnTable: [],
            players: [
                createPlayer("John"),
                createPlayer("Adam"),
                createPlayer("Amy")
            ]
        }
        const updatedGame = dealRound(game)
        expect(updatedGame.deck).toEqual([
            { rank: 7, suit: "CLUBS" },
            { rank: 1, suit: "SPADES"},
        ])
        expect(updatedGame.players.map(p => p.cards)).toEqual([
            [
                { rank: 4, suit: "CLUBS" },
                { rank: 3, suit: "SPADES"}, 
            ],
            [
                { rank: 5, suit: "CLUBS" },
                { rank: 8, suit: "SPADES"},
            ],
            [
                { rank: 9, suit: "CLUBS" },
                { rank: 10, suit: "SPADES"}, 
            ],
        ])
    })
})
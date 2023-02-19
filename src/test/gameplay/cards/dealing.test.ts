import { createPlayer } from "../../../gameManagement"
import { dealRound, revealCards } from "../../../gameplay/cards/dealing"
import { Game } from "../../../types"

describe("dealRound function", () => {
    it("should deal cards to players as expected", () => {
        const game: Game = {
            id: "1",
            pot: 322,
            betAmount: 0,
            turnToBet: "foo",
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
            ],
            started: true
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

describe("revealCards function", () => {
    it("should work as expected with different numbers of cards", () => {
        const game: Game = {
            id: "1",
            pot: 322,
            betAmount: 0,
            turnToBet: "foo",
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
            players: [],
            started: true
        }

        const gameAfterFlop = revealCards(game, 3)
        expect(gameAfterFlop).toEqual({
            id: "1",
            pot: 322,
            betAmount: 0,
            turnToBet: "foo",
            deck: [
                { rank: 8, suit: "SPADES"},
                { rank: 9, suit: "CLUBS" },
                { rank: 10, suit: "SPADES"},
                { rank: 7, suit: "CLUBS" },
                { rank: 1, suit: "SPADES"},
            ],
            cardsOnTable: [
                { rank: 4, suit: "CLUBS" },
                { rank: 3, suit: "SPADES"},
                { rank: 5, suit: "CLUBS" }
            ],
            players: [],
            started: true
        })

        const gameAfterTurn = revealCards(gameAfterFlop, 1)
        expect(gameAfterTurn).toEqual({
            id: "1",
            pot: 322,
            betAmount: 0,
            turnToBet: "foo",
            deck: [
                { rank: 9, suit: "CLUBS" },
                { rank: 10, suit: "SPADES"},
                { rank: 7, suit: "CLUBS" },
                { rank: 1, suit: "SPADES"},
            ],
            cardsOnTable: [
                { rank: 4, suit: "CLUBS" },
                { rank: 3, suit: "SPADES"},
                { rank: 5, suit: "CLUBS" },
                { rank: 8, suit: "SPADES"},
            ],
            players: [],
            started: true
        })
    })
})
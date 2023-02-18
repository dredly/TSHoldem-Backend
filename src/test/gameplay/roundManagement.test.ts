import { makeDeckDefault } from "../../gameplay/cards/cardUtils"
import { blindsRound, getWinners, prepareForRound, sortPlayersByScore, switchRoles } from "../../gameplay/roundManagement"
import { Card, Game, Player } from "../../types"

describe("switchRoles function", () => {
    it("works for 2 players", () => {
        const before: Player[] = [
            {id: "1", name: "player1", role: "SMALL_BLIND", cards: [], money: 42069},
            {id: "2", name: "player2", role: "BIG_BLIND", cards: [], money: 42069}
        ]
        const after = switchRoles(before)
        expect(after).toEqual([
            {id: "1", name: "player1", role: "BIG_BLIND", cards: [], money: 42069},
            {id: "2", name: "player2", role: "SMALL_BLIND", cards: [], money: 42069}
        ])
    })

    it("works for more players with no overshoot", () => {
        const before: Player[] = [
            {id: "1", name: "player1", role: "OTHER", cards: [], money: 42069},
            {id: "2", name: "player2", role: "SMALL_BLIND", cards: [], money: 42069},
            {id: "3", name: "player3", role: "BIG_BLIND", cards: [], money: 42069},
            {id: "4", name: "player4", role: "OTHER", cards: [], money: 42069}
        ]
        const after = switchRoles(before)
        expect(after).toEqual([
            {id: "1", name: "player1", role: "OTHER", cards: [], money: 42069},
            {id: "2", name: "player2", role: "OTHER", cards: [], money: 42069},
            {id: "3", name: "player3", role: "SMALL_BLIND", cards: [], money: 42069},
            {id: "4", name: "player4", role: "BIG_BLIND", cards: [], money: 42069}
        ])
    })

    it("works for more players with overshoot", () => {
        const before: Player[] = [
            {id: "1", name: "player1", role: "OTHER", cards: [], money: 42069},
            {id: "2", name: "player2", role: "OTHER", cards: [], money: 42069},
            {id: "3", name: "player3", role: "SMALL_BLIND", cards: [], money: 42069},
            {id: "4", name: "player4", role: "BIG_BLIND", cards: [], money: 42069}
        ]
        const after = switchRoles(before)
        expect(after).toEqual([
            {id: "1", name: "player1", role: "BIG_BLIND", cards: [], money: 42069},
            {id: "2", name: "player2", role: "OTHER", cards: [], money: 42069},
            {id: "3", name: "player3", role: "OTHER", cards: [], money: 42069},
            {id: "4", name: "player4", role: "SMALL_BLIND", cards: [], money: 42069}
        ])
    })
})

describe("sortPlayersByScoreFunction", () => {
    it("sorts players in the expected order", () => {
        const cardsOnTable: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 9, suit: "SPADES" }
        ]
        const players: Player[] = [
            {
                id: "1",
                name: "Miguel",
                role: "OTHER",
                cards: [
                    { rank: 3, suit: "DIAMONDS" },
                    { rank: 11, suit: "SPADES" }
                ],
                money: 12
            },
            {
                id: "2",
                name: "Jake",
                role: "OTHER",
                cards: [
                    { rank: 2, suit: "SPADES" },
                    { rank: 12, suit: "SPADES" }
                ],
                money: 12
            },
            {
                id: "3",
                name: "Joel",
                role: "OTHER",
                cards: [
                    { rank: 1, suit: "DIAMONDS" },
                    { rank: 8, suit: "HEARTS" }
                ],
                money: 12
            }
        ]

        const sortedPlayerNames = sortPlayersByScore(players, cardsOnTable).map(p => p.name)
        expect(sortedPlayerNames).toEqual(["Jake", "Joel", "Miguel"])
    })
})

describe("getWinners function", () => {
    it("finds a sole winner when there is one", () => {
        const cardsOnTable: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 9, suit: "SPADES" }
        ]
        const players: Player[] = [
            {
                id: "1",
                name: "Miguel",
                role: "OTHER",
                cards: [
                    { rank: 3, suit: "DIAMONDS" },
                    { rank: 11, suit: "SPADES" }
                ],
                money: 12
            },
            {
                id: "2",
                name: "Jake",
                role: "OTHER",
                cards: [
                    { rank: 2, suit: "SPADES" },
                    { rank: 12, suit: "SPADES" }
                ],
                money: 12
            },
            {
                id: "3",
                name: "Joel",
                role: "OTHER",
                cards: [
                    { rank: 1, suit: "DIAMONDS" },
                    { rank: 8, suit: "HEARTS" }
                ],
                money: 12
            }
        ]
        const game: Game = {
            id: "1",
            players,
            cardsOnTable,
            pot: 1000,
            deck: []
        }

        const winnerNames = getWinners(game).map(w => w.name)
        expect(winnerNames).toEqual(["Jake"])
    })

    it("handles a 2 way tie", () => {
        const cardsOnTable: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 9, suit: "SPADES" }
        ]
        const players: Player[] = [
            {
                id: "1",
                name: "Miguel",
                role: "OTHER",
                cards: [
                    { rank: 3, suit: "DIAMONDS" },
                    { rank: 11, suit: "SPADES" }
                ],
                money: 12
            },
            {
                id: "2",
                name: "Jake",
                role: "OTHER",
                cards: [
                    { rank: 1, suit: "SPADES" },
                    { rank: 12, suit: "SPADES" }
                ],
                money: 12
            },
            {
                id: "3",
                name: "Joel",
                role: "OTHER",
                cards: [
                    { rank: 1, suit: "DIAMONDS" },
                    { rank: 8, suit: "HEARTS" }
                ],
                money: 12
            }
        ]
        const game: Game = {
            id: "1",
            players,
            cardsOnTable,
            pot: 1000,
            deck: []
        }

        const winnerNames = getWinners(game).map(w => w.name)
        expect(winnerNames).toHaveLength(2)
        expect(winnerNames).toContain("Jake")
        expect(winnerNames).toContain("Joel")
    })
})

describe("prepareForRound function", () => {
    it("shuffles the cards and orders the players as expected", () => {
        const initialGame: Game = {
            id: "1",
            deck: makeDeckDefault(),
            cardsOnTable: [],
            pot: 0,
            players: [
                {id: "1", name: "player1", role: "OTHER", cards: [], money: 42069},
                {id: "2", name: "player2", role: "OTHER", cards: [], money: 42069},
                {id: "3", name: "player3", role: "SMALL_BLIND", cards: [], money: 42069},
                {id: "4", name: "player4", role: "BIG_BLIND", cards: [], money: 42069}
            ]
        }
        const preparedGame = prepareForRound(initialGame)
        expect(preparedGame.deck).not.toEqual(makeDeckDefault())
        expect(preparedGame.players.map(p => p.id)).toEqual([
            "3", "4", "1", "2"
        ])
    })
})

describe("blindsRound function", () => {
    it("handles the bets and deals out cards as expected", () => {
        const game: Game = {
            id: "1",
            deck: [
                { rank: 4, suit: "CLUBS" },
                { rank: 2, suit: "DIAMONDS" },
                { rank: 2, suit: "HEARTS" },
                { rank: 1, suit: "CLUBS" },
                { rank: 9, suit: "SPADES" },
                { rank: 11, suit: "DIAMONDS"},
                { rank: 8, suit: "SPADES" },
                { rank: 1, suit: "HEARTS"}
            ],
            cardsOnTable: [],
            players: [
                {id: "2", name: "player2", role: "SMALL_BLIND", cards: [], money: 50},
                {id: "3", name: "player3", role: "BIG_BLIND", cards: [], money: 50},
                {id: "1", name: "player4", role: "OTHER", cards: [], money: 50}
            ],
            pot: 0
        }
        const updatedGame = blindsRound(game)
        expect(updatedGame.players.map(p => p.money)).toEqual([49, 48, 50])
        expect(updatedGame.pot).toBe(3)
        expect(updatedGame.deck).toEqual([
            { rank: 8, suit: "SPADES" },
            { rank: 1, suit: "HEARTS"}
        ])
        expect(updatedGame.players.map(p => p.cards)).toEqual([
            [
                { rank: 4, suit: "CLUBS" },
                { rank: 2, suit: "DIAMONDS" },
            ],
            [
                { rank: 2, suit: "HEARTS" },
                { rank: 1, suit: "CLUBS" },
            ],
            [
                { rank: 9, suit: "SPADES" },
                { rank: 11, suit: "DIAMONDS"},
            ]
        ])
    })
})

describe("resetAfterRound function", () => {
    
})
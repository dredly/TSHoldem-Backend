import { createPlayer } from "../../gameManagement"
import { betAmount, getBettingOrder, makeBet, winPot } from "../../gameplay/betting"
import { Player, Game } from "../../types"

describe("getBettingOrder function", () => {
    it("orders players as expected based on their roles", () => {
        const [p1, p2, p3] = ["p1", "p2", "p3"].map(name => createPlayer(name))
        const players: Player[] = [
            p1, 
            { ...p2, role: "SMALL_BLIND" }, 
            { ...p3, role: "BIG_BLIND"}
        ]
        const ordered = getBettingOrder(players)
        expect(ordered.map(p => p.name)).toEqual(["p2", "p3", "p1"])
    })

    it("works when small blind is last in the list", () => {
        const [p1, p2, p3] = ["p1", "p2", "p3"].map(name => createPlayer(name))
        const players: Player[] = [
            { ...p1, role: "BIG_BLIND" }, 
            p2, 
            { ...p3, role: "SMALL_BLIND"}
        ]
        const ordered = getBettingOrder(players)
        expect(ordered.map(p => p.name)).toEqual(["p3", "p1", "p2"])
    })
})

describe("betAmount function", () => {
    it("subtracts money from the player when making a valid bet", () => {
        const player =  { ...createPlayer("bob"), money: 100 }
        expect(betAmount(player, 35).money).toBe(65)
    })
    it("throws an error if a player tries to bet more than they have", () => {
        const player =  { ...createPlayer("bob"), money: 100 }
        expect(() => { betAmount(player, 135).money }).toThrowError("Player does not have enough money")
    })
})

describe("makeBet function", () => {
    it("correctly updates the game when a valid bet is made", () => {
        const player1 =  { ...createPlayer("bob"), money: 100 }
        const player2 = { ...createPlayer("bill"), money: 200 }
        const game: Game = {
            id: "1",
            players: [player1, player2],
            deck: [],
            cardsOnTable: [],
            pot: 600
        }
        const updatedGame = makeBet(game, player2, 80)
        expect(updatedGame.pot).toBe(680)
        expect(updatedGame.players[1].money).toBe(120)
    })
    it("throws an error if an invalid bet is attempted", () => {
        const player1 =  { ...createPlayer("bob"), money: 100 }
        const player2 = { ...createPlayer("bill"), money: 200 }
        const game: Game = {
            id: "1",
            players: [player1, player2],
            deck: [],
            cardsOnTable: [],
            pot: 600
        }
        expect(() => { makeBet(game, player2, 800) }).toThrowError("Player does not have enough money")
    })
})

describe("winPot function", () => {
    it("works with a single winner", () => {
        const player1 =  { ...createPlayer("bob"), money: 100 }
        const player2 = { ...createPlayer("bill"), money: 200 }
        const game: Game = {
            id: "1",
            players: [player1, player2],
            deck: [],
            cardsOnTable: [],
            pot: 600
        }
        const updatedGame = winPot(game, [player1])
        expect(updatedGame.pot).toBe(0)
        expect(updatedGame.players[0].money).toBe(700)
    })
    it("works with multiple winners", () => {
        const player1 =  { ...createPlayer("bob"), money: 100 }
        const player2 = { ...createPlayer("bill"), money: 200 }
        const game: Game = {
            id: "1",
            players: [player1, player2],
            deck: [],
            cardsOnTable: [],
            pot: 600
        }
        const updatedGame = winPot(game, [player1, player2])
        expect(updatedGame.pot).toBe(0)
        expect(updatedGame.players[0].money).toBe(400)
        expect(updatedGame.players[1].money).toBe(500)
    })
})
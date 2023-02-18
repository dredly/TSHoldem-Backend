import { createGame, createPlayer, initialiseRoles, joinGame, leaveGame } from "../gameManagement"
import { Game, Player } from "../types"

describe("createPlayer function", () => {
    it("creates a player with the correct default role", () => {
        const player = createPlayer("Miguel")
        expect(player.role).toBe("OTHER")
    })
})

describe("createGame function", () => {
    it("creates a game with the player who created it in the list of players", () => {
        const testPlayer: Player = {
            id: "1",
            name: "Miguel",
            role: "OTHER",
            cards: [],
            money: 42069,
            moneyInPot: 0,
            inPlay: true
        }
        const newGame = createGame(testPlayer)
        expect(newGame.players).toHaveLength(1)
        expect(newGame.players[0].id).toBe(testPlayer.id)
    })
})

describe("joinGame function", () => {
    it("a player can join a game", () => {
        const host = createPlayer("Miguel")
        const joinee = createPlayer("Bob")
        const miguelsGame = createGame(host)
        const miguelsGameUpdated = joinGame(miguelsGame, joinee)
        expect(miguelsGameUpdated.players).toHaveLength(2)
        expect(miguelsGameUpdated.players[1].name).toBe(joinee.name)
    })
})

describe("leaveGame function", () => {
    it("a player can leave a game", () => {
        const players = ["bob", "alice", "jess"].map(name => createPlayer(name))
        const game: Game = {
            id: "1",
            players,
            deck: [],
            turnToBet: 0,
            cardsOnTable: [],
            pot: 0,
            betAmount: 0
        }
        const updatedGame = leaveGame(game, players[2])
        expect(updatedGame.players).toHaveLength(2)
    })

    it("throws an error if the player is not in that game already", () => {
        const game: Game = {
            id: "1",
            players: [createPlayer("Miguel")],
            deck: [],
            turnToBet: 0,
            cardsOnTable: [],
            pot: 0,
            betAmount: 0
        }
        const playerNotInGame = createPlayer("Outsider Joe")
        expect(() => {leaveGame(game, playerNotInGame)}).toThrowError("Tried to leave game but player not in it")
    })
})

describe("initialiseRoles function", () => {
    it("properly initialises roles for a game with more than 2 players", () => {
        const players = ["bob", "alice", "jess", "miguel"].map(name => createPlayer(name))
        const roles = initialiseRoles(players).map(p => p.role)
        expect(roles).toEqual(["OTHER", "SMALL_BLIND", "BIG_BLIND", "OTHER"])
    })

    it("properly intialises roles for a game with 2 players", () => {
        const players = ["bob", "alice"].map(name => createPlayer(name))
        const roles = initialiseRoles(players).map(p => p.role)
        expect(roles).toEqual(["BIG_BLIND", "SMALL_BLIND"])
    })

    it("throws an error if there are less than 2 players", () => {
        const notEnoughPlayers = ["bob"].map(name => createPlayer(name))
        expect(() => {initialiseRoles(notEnoughPlayers)}).toThrowError("not enough players")
    })
})
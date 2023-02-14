import { createGame, createPlayer, joinGame, leaveGame } from "../gameManagement"
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
            role: "OTHER"
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
            players
        }
        const updatedGame = leaveGame(game, players[2])
        expect(updatedGame.players).toHaveLength(2)
    })
    it("throws an error if the player is not in that game already", () => {
        const game: Game = {
            id: "1",
            players: [createPlayer("Miguel")]
        }
        const playerNotInGame = createPlayer("Outsider Joe")
        expect(() => {leaveGame(game, playerNotInGame)}).toThrowError("Tried to leave game but player not in it")
    })
})
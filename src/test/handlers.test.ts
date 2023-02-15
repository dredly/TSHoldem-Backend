import { createGame, createPlayer } from "../gameManagement"
import { handleGameCreation, handleJoin, handlePlayerCreation } from "../handlers"
import { ApplicationState } from "../types"

describe("handlePlayerCreation function", () => {
    it("adds a player to the application state", () => {
        const state: ApplicationState = {
            players: [],
            games: []
        }
        handlePlayerCreation({ name: "miguel" }, state)
        expect(state.players).toHaveLength(1)
        expect(state.players[0].name).toBe("miguel")
    })
})

describe("handleGameCreation function", () => {
    it("adds a game to the application state and removes the player from the list of players", () => {
        const player = createPlayer("Joe")
        const playerId = player.id
        const state: ApplicationState = {
            players: [player],
            games: []
        }
        handleGameCreation({ playerId }, state)
        expect(state.players).toHaveLength(0)
        expect(state.games).toHaveLength(1)
        expect(state.games[0].players[0]).toEqual(player)
    })

    it("throws an error if given a player id not in the list of players", () => {
        const state: ApplicationState = {
            players: [],
            games: []
        }
        expect(() => { handleGameCreation({ playerId: "foo" }, state) }).toThrowError("player not found")
    })
})

describe("handleJoin function", () => {
    it("works as intended when an existing player joins an existing game", () => {
        const host = createPlayer("Joe")
        const joinee = createPlayer("Alice")
        const game = createGame(host)
        const state: ApplicationState = {
            players: [joinee],
            games: [
                {
                    id: "1",
                    players: [host]
                }
            ]
        }
        handleJoin({ playerId: joinee.id, gameId: state.games[0].id }, state)
        expect(state.players).toHaveLength(0)
        expect(state.games[0].players).toHaveLength(2)
        expect(state.games[0].players[1].name).toBe("Alice")
    })
})
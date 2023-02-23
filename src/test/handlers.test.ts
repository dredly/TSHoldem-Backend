import { WebSocket } from "ws"
import { createGame, createPlayer } from "../gameManagement"
import { handleGameCreation, handleJoin, handlePlayerCreation } from "../handlers"
import { ApplicationState } from "../types"

jest.mock("../server/publishing.ts")
jest.mock("ws")
const mockWs =  () => new WebSocket("ws://localhost:8080")
const mockPubSubInfo = () => new Map()

describe("handlePlayerCreation function", () => {
    it("adds a player to the application state", () => {
        const state: ApplicationState = {
            players: [],
            games: []
        }
        handlePlayerCreation({ name: "miguel" }, state, mockWs(), mockPubSubInfo())
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
        handleGameCreation({ playerId }, state, mockWs())
        expect(state.players).toHaveLength(0)
        expect(state.games).toHaveLength(1)
        expect(state.games[0].players[0]).toEqual(player)
    })

    it("throws an error if given a player id not in the list of players", () => {
        const state: ApplicationState = {
            players: [],
            games: []
        }
        expect(() => { handleGameCreation({ playerId: "foo" }, state, mockWs()) }).toThrowError("player not found")
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
                    players: [host],
                    deck: [],
                    turnToBet: host.id,
                    cardsOnTable: [],
                    pot: 0,
                    betAmount: 0,
                    started: false
                }
            ]
        }
        handleJoin({ playerId: joinee.id, gameId: state.games[0].id }, state, mockPubSubInfo())
        expect(state.players).toHaveLength(0)
        expect(state.games[0].players).toHaveLength(2)
        expect(state.games[0].players[1].name).toBe("Alice")
    })

    it("throws an error if given a player id not in the list of players", () => {
        const state: ApplicationState = {
            players: [createPlayer("miguel")],
            games: [
                {
                    id: "1",
                    players: [createPlayer("bob")],
                    deck: [],
                    turnToBet: "foo",
                    cardsOnTable: [],
                    pot: 0,
                    betAmount: 0,
                    started: false
                }
            ]
        }
        expect(() => {handleJoin({ playerId: "foo", gameId: "1" }, state, mockPubSubInfo())}).toThrowError("player not found")
    })

    it("throws an error if given a game id not in the list of games", () => {
        const joinee = createPlayer("miguel")
        const state: ApplicationState = {
            players: [joinee],
            games: [
                {
                    id: "1",
                    players: [createPlayer("bob")],
                    deck: [],
                    turnToBet: "foo",
                    cardsOnTable: [],
                    pot: 0,
                    betAmount: 0,
                    started: false
                }
            ]
        }
        expect(() => {handleJoin({ playerId: joinee.id, gameId: "foo" }, state, mockPubSubInfo())}).toThrowError("game not found")
    })
})
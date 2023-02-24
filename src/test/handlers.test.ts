import { WebSocket } from "ws"
import { gameConfig } from "../gameConfig"
import { createGame, createPlayer } from "../gameManagement"
import { handleBet, handleGameCreation, handleJoin, handlePlayerCreation } from "../handlers"
import { ApplicationState, Game } from "../types"

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

describe("handleBet function", () => {
    it("works as intended when given valid arguments", () => {
        const player1 = createPlayer("Tim")
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name))
        const game: Game = { ...createGame(player1), players: [player1].concat([player2, player3]) }
        const state: ApplicationState = {
            players: [],
            games: [game]
        }

        handleBet({ playerId: player1.id, amount: 38 }, state, mockPubSubInfo())
        expect(state.games[0].betAmount).toBe(38)
        expect(state.games[0].pot).toBe(38)
        expect(state.games[0].players[0].money).toBe(gameConfig.startingMoney - 38)
        expect(state.games[0].players[0].moneyInPot).toBe(38)
        expect(state.games[0].turnToBet).toBe(player2.id)
    })

    it("throws an exception when player tries to bet more than they have", () => {
        const player1 = createPlayer("Tim")
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name))
        const game: Game = { ...createGame(player1), players: [player1].concat([player2, player3]) }
        const state: ApplicationState = {
            players: [],
            games: [game]
        }

        expect(() => {handleBet({ playerId: player1.id, amount: 8000 }, state, mockPubSubInfo())})
            .toThrowError("Player does not have enough money")
    })

    it("throws an exception when player tries to bet out of turn", () => {
        const player1 = createPlayer("Tim")
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name))
        const game: Game = { ...createGame(player1), players: [player1].concat([player2, player3]) }
        const state: ApplicationState = {
            players: [],
            games: [game]
        }

        expect(() => {handleBet({ playerId: player2.id, amount: 20 }, state, mockPubSubInfo())})
            .toThrowError("player betting out of turn")
    })

    it("throws an exception if player not found in a game", () => {
        const state: ApplicationState = {
            players: [],
            games: []
        }
        expect(() => {handleBet({ playerId: "foo", amount: 20 }, state, mockPubSubInfo())})
            .toThrowError("game with that player not found")
    })
})
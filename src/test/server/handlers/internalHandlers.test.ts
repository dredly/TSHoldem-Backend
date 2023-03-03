import { createGame, createPlayer } from "../../../gameManagement"
import { makeDeckDefault } from "../../../gameplay/cards/cardUtils"
import { handleDealing } from "../../../server/handlers/internalHandlers"
import { Game, ApplicationState } from "../../../types"

jest.mock("../../../server/publishing.ts")
jest.mock("ws")
const mockPubSubInfo = () => new Map()

describe("handleDealing function", () => {
    it("deals the flop", () => {
        const player1 = createPlayer("Tim")
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name))
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]),
            turnToBet: player1.id,
            bettingInfo: {
                round: "FLOP",
                isSecondPass: false
            }
        }
        const state: ApplicationState = {
            players: [],
            games: [game]
        }

        const deckSizeBefore = game.deck.length
        const cardsOnTableSizeBefore = game.cardsOnTable.length

        handleDealing(game, state, mockPubSubInfo())
        expect(state.games[0].deck).toHaveLength(deckSizeBefore - 3)
        expect(state.games[0].cardsOnTable).toHaveLength(cardsOnTableSizeBefore + 3)
    })

    it("deals the turn", () => {
        const player1 = createPlayer("Tim")
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name))
        const defaultDeck = makeDeckDefault()

        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]),
            turnToBet: player1.id,
            bettingInfo: {
                round: "TURN",
                isSecondPass: false
            },
            deck: defaultDeck.slice(3),
            cardsOnTable: defaultDeck.slice(0, 3)
        }

        const deckSizeBefore = game.deck.length
        const cardsOnTableSizeBefore = game.cardsOnTable.length

        const state: ApplicationState = {
            players: [],
            games: [game]
        }

        handleDealing(game, state, mockPubSubInfo())
        expect(state.games[0].deck).toHaveLength(deckSizeBefore - 1)
        expect(state.games[0].cardsOnTable).toHaveLength(cardsOnTableSizeBefore + 1)
    })
})
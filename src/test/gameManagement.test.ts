import { createGame } from "../gameManagement"
import { Player } from "../types"

describe("createGame function", () => {
    it("works", () => {
        const testPlayer: Player = {
            id: "1",
            name: "Miguel",
            role: "OTHER"
        }
        const newGame = createGame(testPlayer)
        expect(newGame.players).toHaveLength(1)
    })
})
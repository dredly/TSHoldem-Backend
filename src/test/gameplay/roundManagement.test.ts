import { switchRoles } from "../../gameplay/roundManagement"
import { Player } from "../../types"

describe("switchRoles function", () => {
    it("works for 2 players", () => {
        const before: Player[] = [
            {id: "1", name: "player1", role: "SMALL_BLIND", money: 42069},
            {id: "2", name: "player2", role: "BIG_BLIND", money: 42069}
        ]
        const after = switchRoles(before)
        expect(after).toEqual([
            {id: "1", name: "player1", role: "BIG_BLIND", money: 42069},
            {id: "2", name: "player2", role: "SMALL_BLIND", money: 42069}
        ])
    })

    it("works for more players with no overshoot", () => {
        const before: Player[] = [
            {id: "1", name: "player1", role: "OTHER", money: 42069},
            {id: "2", name: "player2", role: "SMALL_BLIND", money: 42069},
            {id: "3", name: "player3", role: "BIG_BLIND", money: 42069},
            {id: "4", name: "player4", role: "OTHER", money: 42069}
        ]
        const after = switchRoles(before)
        expect(after).toEqual([
            {id: "1", name: "player1", role: "OTHER", money: 42069},
            {id: "2", name: "player2", role: "OTHER", money: 42069},
            {id: "3", name: "player3", role: "SMALL_BLIND", money: 42069},
            {id: "4", name: "player4", role: "BIG_BLIND", money: 42069}
        ])
    })

    it("works for more players with overshoot", () => {
        const before: Player[] = [
            {id: "1", name: "player1", role: "OTHER", money: 42069},
            {id: "2", name: "player2", role: "OTHER", money: 42069},
            {id: "3", name: "player3", role: "SMALL_BLIND", money: 42069},
            {id: "4", name: "player4", role: "BIG_BLIND", money: 42069}
        ]
        const after = switchRoles(before)
        expect(after).toEqual([
            {id: "1", name: "player1", role: "BIG_BLIND", money: 42069},
            {id: "2", name: "player2", role: "OTHER", money: 42069},
            {id: "3", name: "player3", role: "OTHER", money: 42069},
            {id: "4", name: "player4", role: "SMALL_BLIND", money: 42069}
        ])
    })
})
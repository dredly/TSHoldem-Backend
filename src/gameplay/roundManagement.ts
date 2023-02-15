import { Player } from "../types";

export const switchRoles = (players: Player[]): Player[] => {
    return players
        .map((p, idx, arr) => {
            if (idx > 0) {
                return { ...p, role: arr[idx - 1].role }
            }
            return { ...p, role: arr[arr.length - 1].role }
        })
}
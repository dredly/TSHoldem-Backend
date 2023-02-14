import { randomUUID } from "crypto";
import { Game, Player } from "./types";

export const createGame = (player: Player): Game => {
    return {
        id: randomUUID(),
        players: [player]
    }
}
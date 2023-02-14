import { randomUUID } from "crypto";
import { Game, Player } from "./types";

export const createPlayer = (name: String): Player => {
    return {
        id: randomUUID(),
        name,
        role: "OTHER"
    }
}

export const createGame = (player: Player): Game => {
    return {
        id: randomUUID(),
        players: [player]
    }
}

export const joinGame = (game: Game, player: Player): Game => {
    return {
        ...game,
        players: game.players.concat(player)
    }
}

export const leaveGame = (game: Game, player: Player): Game => {
    if (!game.players.find(p => p.id === player.id)) {
        throw new Error("Tried to leave game but player not in it")
    }
    return {
        ...game,
        players: game.players.filter(p => p.id !== player.id)
    }
}
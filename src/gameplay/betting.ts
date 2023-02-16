import { Game, Player } from "../types";

export const getBettingOrder = (players: Player[]): Player[] => {
    const smallBlindIdx = players.findIndex(p => p.role == "SMALL_BLIND")
    if (smallBlindIdx < 0) {
        throw new Error("Player with role SMALL_BLIND not found")
    }
    return players.slice(smallBlindIdx).concat(players.slice(0, smallBlindIdx))
}

export const betAmount = (player: Player, amount: number): Player => {
    if (amount > player.money) {
        throw new Error("Player does not have enough money")
    }
    return { ...player, money: player.money - amount }
}

export const makeBet = (game: Game, player: Player, amount: number): Game => {
    const updatedPlayer = betAmount(player, amount)
    return { 
        ...game, 
        pot: game.pot + amount,
        players: game.players.map(p => p.id === player.id ? updatedPlayer : p)
    }
}
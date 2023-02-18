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
    return { ...player, money: player.money - amount, moneyInPot: player.moneyInPot + amount }
}

export const fold = (player: Player): Player => {
    return { ...player, inPlay: false }
}

export const updateGameWithBet = (game: Game, player: Player, amount: number): Game => {
    const updatedPlayer = betAmount(player, amount)
    return { 
        ...game, 
        pot: game.pot + amount,
        betAmount: Math.max(game.betAmount, updatedPlayer.moneyInPot),
        players: game.players.map(p => p.id === player.id ? updatedPlayer : p)
    }
}

export const updateGameWithCall = (game: Game, player: Player): Game => {
    const amountToCall = game.betAmount - player.moneyInPot
    return updateGameWithBet(game, player, amountToCall)
}

export const updateGameWithRaise = (game: Game, player: Player, raiseBy: number): Game => {
    const amountToRaise = (game.betAmount + raiseBy) - player.moneyInPot
    return updateGameWithBet(game, player, amountToRaise)
}

export const updateGameWithFold = (game: Game, player: Player): Game => {
    return {
        ...game,
        players: game.players.map(p => p.id === player.id ? fold(p) : p)
    }
}

export const checkForOutstandingBets = (game: Game): boolean => {
    // Function to be called at end of round of betting to see if there are players who still need to respond to a raise
    return game.players
        .filter(p => p.inPlay)
        .some(p => p.moneyInPot < game.betAmount)
}

export const winPot = (game: Game, winners: Player[]): Game => {
    const winnerIds = winners.map(w => w.id)
    const share = Math.floor(game.pot / winners.length)
    return {
        ...game,
        pot: 0,
        players: game.players.map(p => winnerIds.includes(p.id) ? { ...p, money: p.money + share } : p)
    }
}
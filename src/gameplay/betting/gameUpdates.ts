import { Game, Player, BettingInfo } from "../../types";
import { betAmount, fold, getBettingPlayer, nextPlayerToBet } from "./bettingUtils";

export const updateGameWithBet = (game: Game, player: Player, amount: number): Game => {
    const updatedPlayer = betAmount(player, amount);
    return { 
        ...game,
        betAmount: Math.max(game.betAmount, updatedPlayer.moneyInPot),
        players: game.players.map(p => p.id === player.id ? updatedPlayer : p)
    };
};

export const updateGameWithCall = (game: Game, player: Player): Game => {
    const amountToCall = game.betAmount - player.moneyInPot;
    return updateGameWithBet(game, player, amountToCall);
};

export const updateGameWithRaise = (game: Game, player: Player, raiseBy: number): Game => {
    const amountToRaise = (game.betAmount + raiseBy) - player.moneyInPot;
    return updateGameWithBet(game, player, amountToRaise);
};

export const updateGameWithFold = (game: Game, player: Player): Game => {
    return {
        ...game,
        players: game.players.map(p => p.id === player.id ? fold(p) : p)
    };
};

export const updateGameWithNextBet = (game: Game): Game => {
    if (!game.bettingInfo) throw new Error("Betting info undefined");
    const nextPlayerToBetId = nextPlayerToBet(game);
    if (!nextPlayerToBetId) {
        let updatedBettingInfo: BettingInfo | undefined;
        switch (game.bettingInfo?.round) {
            case "BLINDS":
                updatedBettingInfo = {
                    round: "FLOP",
                    isSecondPass: false
                };
                break;
            case "FLOP":
                updatedBettingInfo = {
                    round: "TURN",
                    isSecondPass: false
                };
                break;
            case "TURN":
                updatedBettingInfo = {
                    round: "RIVER",
                    isSecondPass: false
                };
                break;
            case "RIVER":
                updatedBettingInfo = undefined;
                break;
            default:
                throw new Error("Unexpected betting info");
        }
        return { 
            ...game,
            turnToBet: game.players.filter(p => p.inPlay)[0].id, 
            bettingInfo: updatedBettingInfo 
        };
    }
    // Check if we are going into a second pass of bets
    if (game.players.findIndex(p => p.id === nextPlayerToBetId) < game.players.findIndex(p => p.id === game.turnToBet)) {
        return { 
            ...game,
            turnToBet: nextPlayerToBetId,
            bettingInfo: { ...game.bettingInfo, isSecondPass: true } 
        };
    }
    return { ...game, turnToBet: nextPlayerToBetId };
};

export const updateGameWithBetAndMoveOn = (game: Game, player: Player, amount: number): Game => {
    return updateGameWithNextBet(updateGameWithBet(game, player,amount));
};

export const updateGameWithBetFromPlayerId = (game: Game, playerId: string, amount: number): Game => {
    const player = getBettingPlayer(game, playerId);
    return updateGameWithBetAndMoveOn(game, player, amount);
};

export const updateGameWithFoldFromPlayerId = (game: Game, playerId: string): Game => {
    const player = getBettingPlayer(game, playerId);
    return updateGameWithFold(game, player);
};
import { BettingInfo, Game, Player } from "../types";

export const getBettingOrder = (players: Player[]): Player[] => {
    const smallBlindIdx = players.findIndex(p => p.role == "SMALL_BLIND");
    if (smallBlindIdx < 0) {
        throw new Error("Player with role SMALL_BLIND not found");
    }
    return players.slice(smallBlindIdx).concat(players.slice(0, smallBlindIdx));
};

export const nextPlayerToBet = (game: Game): string | undefined => {
    // Returns either the id of the next player to bet, or undefined if the round of betting is over
    const playersInPlay = game.players.filter(p => p.inPlay);
    const playerIdx = playersInPlay.findIndex(p => p.id === game.turnToBet);
    console.debug("playersInPlay", playersInPlay);
    console.debug("playerIdx", playerIdx);
    if (playerIdx === playersInPlay.length - 1) {
        return playersInPlay.find(p => p.moneyInPot < game.betAmount)?.id;
    }
    if (game.bettingInfo && game.bettingInfo.isSecondPass) {
        return playersInPlay.slice(playerIdx + 1)
            .concat(playersInPlay.slice(0, playerIdx + 1))
            .find(p => p.moneyInPot < game.betAmount)?.id;
    }
    return playersInPlay[playerIdx + 1].id;
};

export const betAmount = (player: Player, amount: number): Player => {
    if (amount > player.money) {
        throw new Error("Player does not have enough money");
    }
    return { ...player, money: player.money - amount, moneyInPot: player.moneyInPot + amount };
};

export const fold = (player: Player): Player => {
    return { ...player, inPlay: false };
};

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

const getWinningsFromOtherPlayer = (winner: Player, otherPlayer: Player, numOfWinners: number): number => {
    // Ensures that a player cannot win more than they put in
    return Math.min(winner.moneyInPot, Math.floor(otherPlayer.moneyInPot / numOfWinners));
};

export const winPot = (game: Game, playersRankedByScore: Player[][]): Game => {
    const winners = playersRankedByScore[0];
    const losers = playersRankedByScore
        .slice(1)
        .flat()
        .concat(game.players.filter(p => !p.inPlay));
    for (const winner of winners) {
        for (const loser of losers) {
            const moneyToTake = getWinningsFromOtherPlayer(winner, loser, winners.length);
            winner.money += moneyToTake;
            loser.moneyInPot -= moneyToTake;
        }
        // The winner also gets back the money they put in of course
        winner.money += winner.moneyInPot;
        winner.moneyInPot = 0;
    }

    const winnersAndLosers = winners.concat(losers);

    const gameUpdatedWithWinnings = {
        ...game,
        players: game.players
            .map(p => {
                const updatedPlayer = winnersAndLosers.find(wl => wl.id === p.id);
                if (!updatedPlayer) {
                    throw new Error("Could not find player in winners and losers");
                }
                return updatedPlayer;
            })
            .filter(p => p.money)
    };

    const losersWithMoneyLeft = losers.filter(loser => loser.moneyInPot);
    if (losersWithMoneyLeft.length) {
        return winPot(gameUpdatedWithWinnings, playersRankedByScore.slice(1));
    }

    return gameUpdatedWithWinnings;
};

export const getAmountInPot = (game: Game): number => {
    return game.players
        .map(p => p.moneyInPot)
        .reduce((a, b) => a + b);
};
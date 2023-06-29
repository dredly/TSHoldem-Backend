import { Player, Game } from "../../types";

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
                    return p;
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
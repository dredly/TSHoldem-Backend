import { Player, Game } from "../../types";

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

export const getAmountInPot = (game: Game): number => {
    return game.players
        .map(p => p.moneyInPot)
        .reduce((a, b) => a + b);
};
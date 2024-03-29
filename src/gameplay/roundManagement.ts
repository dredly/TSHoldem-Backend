import shuffle from "lodash.shuffle";
import { gameConfig } from "../gameConfig";
import { Card, Game, Player } from "../types";
import { getBettingOrder } from "./betting/bettingUtils";
import { updateGameWithBet } from "./betting/gameUpdates";
import { makeDeckDefault } from "./cards/cardUtils";
import { dealRound } from "./cards/dealing";
import { compareHands } from "./cards/handComparison";
import { allHandCheckers, findBestHand } from "./cards/handEvaluation";
import { winPot } from "./betting/winning";

export const switchRoles = (players: Player[]): Player[] => {
    return players
        .map((p, idx, arr) => {
            if (idx > 0) {
                return { ...p, role: arr[idx - 1].role };
            }
            return { ...p, role: arr[arr.length - 1].role };
        });
};

export const groupPlayersByScore = (players: Player[], cardsOnTable: Card[]): Player[][] => {
    const result: Map<string, Player[]> = new Map();
    for (const player of players) {
        const score = findBestHand(player.cards.concat(cardsOnTable), allHandCheckers);
        const existingGroup = result.get(JSON.stringify(score));
        if (existingGroup) {
            result.set(JSON.stringify(score), existingGroup.concat(player));
        } else {
            result.set(JSON.stringify(score), [player]);
        }
    }
    return [ ...result.values() ]
        .sort((g1, g2) => -compareHands(g1[0].cards.concat(cardsOnTable), g2[0].cards.concat(cardsOnTable)));
};

export const getWinners = (game: Game): Player[] => {
    // For now just worry about getting the first group of winners as we arent doing all ins / partial pots yet
    // probably need to filter out inactive players too in the future
    const groupedByScore = groupPlayersByScore(game.players, game.cardsOnTable);
    return groupedByScore[0];
};

export const prepareForRound = (game: Game): Game => {
    return {
        ...game, 
        deck: shuffle(game.deck),
        players: getBettingOrder(game.players),
    };
};

export const blindsRound = (game: Game): Game => {
    const smallBlindAmount = getSmallBlind(game.round);
    const bigBlindAmount = 2 * smallBlindAmount;
    const gameAfterDealing = dealRound(game);
    // Assume the player are in order small blind, big blind, rest
    const gameAfterSmallBlind = updateGameWithBet(gameAfterDealing, gameAfterDealing.players[0], smallBlindAmount);
    const gameAfterBigBlind = updateGameWithBet(gameAfterSmallBlind, gameAfterSmallBlind.players[1], bigBlindAmount);
    return {
        ...gameAfterBigBlind,
        turnToBet: gameAfterBigBlind.players[0].id,
        bettingInfo: {
            round: "BLINDS",
            isSecondPass: false
        }
    }; 
};

export const resetAfterRound = (game: Game): Game => {
    return {
        ...game,
        betAmount: 0,
        deck: makeDeckDefault(),
        cardsOnTable: [],
        players: switchRoles(game.players.map(p => ( { ...p, cards: [], moneyInPot: 0 } ))),
        bettingInfo: undefined,
        round: game.round + 1
    };
};

export const updateGameWithEndOfRound = (game: Game): Game => {
    const activePlayersByScore = groupPlayersByScore(game.players.filter(p => p.inPlay), game.cardsOnTable);
    const gameUpdatedWithWinnings = winPot(game, activePlayersByScore);
    return blindsRound(
        prepareForRound(
            resetAfterRound(gameUpdatedWithWinnings)
        )
    );
};

function getSmallBlind(round: number): number {
    const lookupIdx = Math.min(
        Math.floor(round / gameConfig.roundsPerBlindIncrease), gameConfig.smallBlinds.length - 1
    );
    return gameConfig.smallBlinds[lookupIdx];
}
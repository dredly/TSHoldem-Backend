import { GameConfig } from "./types";

export const gameConfig: GameConfig = {
    startingMoney: 500,
    startingSmallBlind: 1,
    // order of the ranking is important
    handRankings: [
        "FOUR OF A KIND",
        "FLUSH",
        "STRAIGHT",
        "THREE OF A KIND",
        "PAIR",
        "HIGH CARD"
    ],
    blindIncreases: [
        4, 8, 10, 15, 20, 30, 50, 80, 100
    ],
    roundsPerBlindIncrease: 4
};
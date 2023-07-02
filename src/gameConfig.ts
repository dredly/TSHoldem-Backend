import { GameConfig } from "./types";

export const gameConfig: GameConfig = {
    startingMoney: 500,
    // order of the ranking is important
    handRankings: [
        "FOUR OF A KIND",
        "FLUSH",
        "STRAIGHT",
        "THREE OF A KIND",
        "PAIR",
        "HIGH CARD"
    ],
    smallBlinds: [
        1, 2, 4, 5, 10, 20, 30, 50, 80, 100
    ],
    roundsPerBlindIncrease: 4
};
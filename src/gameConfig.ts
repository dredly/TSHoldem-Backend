import { GameConfig } from "./types";

export const gameConfig: GameConfig = {
    startingMoney: 500,
    startingBlind: 2,
    // order of the ranking is important
    handRankings: [
        'FOUR OF A KIND',
        'FLUSH',
        'STRAIGHT',
        'THREE OF A KIND',
        'PAIR',
        'HIGH CARD'
    ]
}
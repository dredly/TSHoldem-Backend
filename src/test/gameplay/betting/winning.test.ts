import { createPlayer } from "../../../gameManagement";
import { getAmountInPot } from "../../../gameplay/betting/bettingUtils";
import { winPot } from "../../../gameplay/betting/winning";
import { Game } from "../../../types";

describe("winPot function", () => {
    it("works with a single winner", () => {
        const player1 =  { ...createPlayer("bob"), money: 100, moneyInPot: 300 };
        const player2 = { ...createPlayer("bill"), money: 200, moneyInPot: 300 };
        const game: Game = {
            id: "1",
            players: [player1, player2],
            deck: [],
            cardsOnTable: [],
            turnToBet: "foo",
            betAmount: 0,
            started: true,
            round: 0
        };
        const updatedGame = winPot(game, [[player1], [player2]]);
        expect(updatedGame.players[0].money).toBe(700);
        assertNoMoneyLeftInPot(updatedGame);
    });

    it("works with multiple winners", () => {
        const player1 =  { ...createPlayer("bob"), money: 100, moneyInPot: 300 };
        const player2 = { ...createPlayer("bill"), money: 200, moneyInPot: 300 };
        const game: Game = {
            id: "1",
            players: [player1, player2],
            deck: [],
            cardsOnTable: [],
            turnToBet: "foo",
            betAmount: 0,
            started: true,
            round: 0
        };
        const updatedGame = winPot(game, [[player1, player2]]);
        expect(updatedGame.players[0].money).toBe(400);
        expect(updatedGame.players[1].money).toBe(500);
        assertNoMoneyLeftInPot(updatedGame);
    });

    it("eliminates any players who end up with no money", () => {
        const player1 =  { ...createPlayer("bob"), money: 0, moneyInPot: 200 };
        const player2 = { ...createPlayer("bill"), money: 200, moneyInPot: 200 };
        const player3 = { ...createPlayer("alice"), money: 200, moneyInPot: 200 };
        const game: Game = {
            id: "1",
            players: [player1, player2, player3],
            deck: [],
            cardsOnTable: [],
            turnToBet: "foo",
            betAmount: 0,
            started: true,
            round: 0
        };
        const updatedGame = winPot(game, [[player2], [player1, player3]]);
        expect(updatedGame.players).toHaveLength(2);
        expect(updatedGame.players[0].money).toBe(800);
        expect(updatedGame.players[1].money).toBe(200);
        assertNoMoneyLeftInPot(updatedGame);
    });

    it("does not eliminate a player who went all in but then wins the pot", () => {
        const player1 =  { ...createPlayer("bob"), money: 0, moneyInPot: 200 };
        const player2 = { ...createPlayer("bill"), money: 200, moneyInPot: 200 };
        const player3 = { ...createPlayer("alice"), money: 200, moneyInPot: 200 };
        const game: Game = {
            id: "1",
            players: [player1, player2, player3],
            deck: [],
            cardsOnTable: [],
            turnToBet: "foo",
            betAmount: 0,
            started: true,
            round: 0
        };
        const updatedGame = winPot(game, [[player1], [player2, player3]]);
        expect(updatedGame.players).toHaveLength(3);
        assertNoMoneyLeftInPot(updatedGame);
    });

    it("when the winner cant take all the money, the second place player gets some money too", () => {
        const player1 =  { ...createPlayer("bob"), money: 200, moneyInPot: 200 };
        const player2 = { ...createPlayer("bill"), money: 200, moneyInPot: 500 };
        const player3 = { ...createPlayer("alice"), money: 200, moneyInPot: 500 };
        const game: Game = {
            id: "1",
            players: [player1, player2, player3],
            deck: [],
            cardsOnTable: [],
            turnToBet: "foo",
            betAmount: 0,
            started: true,
            round: 0
        };
        const updatedGame = winPot(game, [[player1], [player2], [player3]]);
        expect(updatedGame.players[0].money).toBe(800);
        expect(updatedGame.players[1].money).toBe(800);
        expect(updatedGame.players[2].money).toBe(200);
        assertNoMoneyLeftInPot(updatedGame);
    });
});

function assertNoMoneyLeftInPot(game: Game) {
    expect(getAmountInPot(game)).toBe(0);
}
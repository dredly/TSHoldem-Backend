import { createPlayer, createGame } from "../../../gameManagement";
import { updateGameWithNextBet, updateGameWithBet } from "../../../gameplay/betting/gameUpdates";
import { Game } from "../../../types";

describe("updateGameWithNextBet function", () => {
    it("updates the game with the next player in the betting order", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]),
            bettingInfo: {
                round: "BLINDS",
                isSecondPass: false
            }
        }; 
        const expectedUpdatedGame: Game = {
            ...game,
            turnToBet: player2.id
        };
        expect(updateGameWithNextBet(game)).toEqual(expectedUpdatedGame);
    });

    it("updates bettingInfo as expected for second pass of betting", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]), 
            turnToBet: player3.id,
            bettingInfo: {
                round: "BLINDS",
                isSecondPass: false
            }
        };
        const gameWithBets = updateGameWithBet(
            updateGameWithBet(game, player2, 10),
            player3,
            10
        );
        const expectedUpdatedGame: Game = {
            ...gameWithBets,
            turnToBet: player1.id,
            bettingInfo: {
                round: "BLINDS",
                isSecondPass: true
            }
        };
        expect(updateGameWithNextBet(gameWithBets)).toEqual(expectedUpdatedGame);
    });

    it("updates bettingInfo as expected when moving to a new betting round", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]), 
            turnToBet: player3.id,
            bettingInfo: {
                round: "FLOP",
                isSecondPass: true
            } 
        };
        const expectedUpdatedGame: Game = {
            ...game,
            turnToBet: player1.id,
            bettingInfo: {
                round: "TURN",
                isSecondPass: false
            }
        };
        expect(updateGameWithNextBet(game)).toEqual(expectedUpdatedGame);
    });

    it("throws an error if bettingInfo on the game is undefined", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]), 
        };
        expect(() => { updateGameWithNextBet(game); }).toThrowError("Betting info undefined");
    });
});
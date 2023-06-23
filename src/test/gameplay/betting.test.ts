import { createGame, createPlayer } from "../../gameManagement";
import { betAmount, getBettingOrder, nextPlayerToBet, updateGameWithBet, updateGameWithNextBet, winPot } from "../../gameplay/betting";
import { Player, Game } from "../../types";

describe("getBettingOrder function", () => {
    it("orders players as expected based on their roles", () => {
        const [p1, p2, p3] = ["p1", "p2", "p3"].map(name => createPlayer(name));
        const players: Player[] = [
            p1, 
            { ...p2, role: "SMALL_BLIND" }, 
            { ...p3, role: "BIG_BLIND"}
        ];
        const ordered = getBettingOrder(players);
        expect(ordered.map(p => p.name)).toEqual(["p2", "p3", "p1"]);
    });

    it("works when small blind is last in the list", () => {
        const [p1, p2, p3] = ["p1", "p2", "p3"].map(name => createPlayer(name));
        const players: Player[] = [
            { ...p1, role: "BIG_BLIND" }, 
            p2, 
            { ...p3, role: "SMALL_BLIND"}
        ];
        const ordered = getBettingOrder(players);
        expect(ordered.map(p => p.name)).toEqual(["p3", "p1", "p2"]);
    });
});

describe("betAmount function", () => {
    it("subtracts money from the player when making a valid bet", () => {
        const player =  { ...createPlayer("bob"), money: 100 };
        expect(betAmount(player, 35).money).toBe(65);
    });
    it("throws an error if a player tries to bet more than they have", () => {
        const player =  { ...createPlayer("bob"), money: 100 };
        expect(() => { betAmount(player, 135).money; }).toThrowError("Player does not have enough money");
    });
});

describe("nextPlayerToBet function", () => {
    it("returns the id of the next player in the player list", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { ...createGame(player1), players: [player1].concat([player2, player3]) }; 
        expect(nextPlayerToBet(game)).toBe(player2.id);
    });

    it("skips over a player who is not in play", () => {
        const player1 = createPlayer("Tim");
        const player2: Player = { ...createPlayer("Rudy"), inPlay: false };
        const player3 = createPlayer("Manny");
        const game: Game = { ...createGame(player1), players: [player1].concat([player2, player3]) }; 
        expect(nextPlayerToBet(game)).toBe(player3.id);
    });

    it("returns undefined when player is last in the betting order and there are no outstanding bets", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]), 
            turnToBet: player3.id 
        };
        expect(nextPlayerToBet(game)).toBeUndefined(); 
    });

    it("goes back to a previous player in the betting order if there is an outstanding bet", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]), 
            turnToBet: player3.id 
        };
        const gameWithBets = updateGameWithBet(
            updateGameWithBet(game, player2, 10),
            player3,
            10
        );
        expect(nextPlayerToBet(gameWithBets)).toBe(player1.id); 
    });
});

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

describe("winPot function", () => {
    // TODO: check if updates moneyInPot value for players

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
            started: true
        };
        const updatedGame = winPot(game, [[player1], [player2]]);
        expect(updatedGame.players[0].money).toBe(700);
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
            started: true
        };
        const updatedGame = winPot(game, [[player1, player2]]);
        expect(updatedGame.players[0].money).toBe(400);
        expect(updatedGame.players[1].money).toBe(500);
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
            started: true
        };
        const updatedGame = winPot(game, [[player2], [player1, player3]]);
        expect(updatedGame.players).toHaveLength(2);
        expect(updatedGame.players[0].money).toBe(800);
        expect(updatedGame.players[1].money).toBe(200);
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
            started: true
        };
        const updatedGame = winPot(game, [[player1], [player2, player3]]);
        expect(updatedGame.players).toHaveLength(3);
    });
});
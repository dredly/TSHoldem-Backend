import WebSocket from "ws";
import { gameConfig } from "../../../gameConfig";
import { createPlayer, createGame } from "../../../gameManagement";
import { getAmountInPot } from "../../../gameplay/betting";
import { handleBet, handleFold } from "../../../server/handlers/gamePlayHandlers";
import * as internalHandlers from "../../../server/handlers/internalHandlers";
import { Game, ApplicationState } from "../../../types";

jest.mock("../../../server/publishing.ts");
jest.mock("ws");
jest.mock("../../../server/handlers/internalHandlers.ts");
const mockPubSubInfo = () => new Map<string, WebSocket>();

describe("handleBet function", () => {
    it("works as intended when given valid arguments", () => {
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
        const state: ApplicationState = {
            players: [],
            games: [game]
        };

        handleBet({ bettingPlayerId: player1.id, amount: 38 }, state, mockPubSubInfo());
        expect(state.games[0].betAmount).toBe(38);
        expect(getAmountInPot(state.games[0])).toBe(38);
        expect(state.games[0].players[0].money).toBe(gameConfig.startingMoney - 38);
        expect(state.games[0].players[0].moneyInPot).toBe(38);
        expect(state.games[0].turnToBet).toBe(player2.id);
    });

    it("throws an exception when player tries to bet more than they have", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { ...createGame(player1), players: [player1].concat([player2, player3]) };
        const state: ApplicationState = {
            players: [],
            games: [game]
        };

        expect(() => { handleBet({ bettingPlayerId: player1.id, amount: 8000 }, state, mockPubSubInfo()); })
            .toThrowError("Player does not have enough money");
    });

    it("throws an exception when player tries to bet out of turn", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { ...createGame(player1), players: [player1].concat([player2, player3]) };
        const state: ApplicationState = {
            players: [],
            games: [game]
        };

        expect(() => { handleBet({ bettingPlayerId: player2.id, amount: 20 }, state, mockPubSubInfo()); })
            .toThrowError("player betting out of turn");
    });

    it("throws an exception if player not found in a game", () => {
        const state: ApplicationState = {
            players: [],
            games: []
        };
        expect(() => { handleBet({ bettingPlayerId: "foo", amount: 20 }, state, mockPubSubInfo()); })
            .toThrowError("game with that player not found");
    });

    it("calls the handler for dealing cards if round of betting is over", () => {
        const spy = jest.spyOn(internalHandlers, "handleDealing");

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
        const state: ApplicationState = {
            players: [],
            games: [game]
        };
        handleBet({ bettingPlayerId: player3.id, amount: 0 }, state, mockPubSubInfo());
        expect(spy).toBeCalled();
    });

    it("calls the handler for ending a round when round is over", () => {
        const spy = jest.spyOn(internalHandlers, "handleEndOfRound");

        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]),
            turnToBet: player3.id,
            bettingInfo: {
                round: "RIVER",
                isSecondPass: false
            }
        };
        const state: ApplicationState = {
            players: [],
            games: [game]
        };
        handleBet({ bettingPlayerId: player3.id, amount: 0 }, state, mockPubSubInfo());

        expect(spy).toBeCalled();
    });
});

describe("handleFold function", () => {
    it("works as intended when given valid arguments", () => {
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
        const state: ApplicationState = {
            players: [],
            games: [game]
        };

        handleFold({ foldingPlayerId: player1.id }, state, mockPubSubInfo());
        expect(state.games[0].players[0].inPlay).toBeFalsy();
        expect(state.games[0].players[0].money).toBe(gameConfig.startingMoney);
        expect(state.games[0].turnToBet).toBe(player2.id);
    });

    it("throws an error when player tries to fold out of turn", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { ...createGame(player1), players: [player1].concat([player2, player3]) };
        const state: ApplicationState = {
            players: [],
            games: [game]
        };
        expect(() => { handleFold({ foldingPlayerId: player2.id }, state, mockPubSubInfo()); })
            .toThrowError("player betting out of turn");
    });

    it("throws an exception if player not found in a game", () => {
        const state: ApplicationState = {
            players: [],
            games: []
        };
        expect(() => { handleFold({ foldingPlayerId: "foo" }, state, mockPubSubInfo()); })
            .toThrowError("game with that player not found");
    });

    it("ends the round early if player folding is the second last in play", () => {
        const spy = jest.spyOn(internalHandlers, "handleEndOfRound");

        const player1 = {
            ...createPlayer("Tim"),
            inPlay: false
        };
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]),
            turnToBet: player3.id 
        };
        const state: ApplicationState = {
            players: [],
            games: [game]
        };

        handleFold({ foldingPlayerId: player3.id }, state, mockPubSubInfo());
        expect(spy).toBeCalled();
    });
});
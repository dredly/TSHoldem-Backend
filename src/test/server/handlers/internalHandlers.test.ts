import WebSocket from "ws";
import { gameConfig } from "../../../gameConfig";
import { createGame, createPlayer } from "../../../gameManagement";
import { getAmountInPot } from "../../../gameplay/betting/bettingUtils";
import { makeDeckDefault } from "../../../gameplay/cards/cardUtils";
import { handleDealing, handleEndOfRound } from "../../../server/handlers/internalHandlers";
import { Game, ApplicationState, Player } from "../../../types";

jest.mock("../../../server/publishing.ts");
jest.mock("ws");
const mockPubSubInfo = () => new Map<string, WebSocket>();

describe("handleDealing function", () => {
    it("deals the flop", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]),
            turnToBet: player1.id,
            bettingInfo: {
                round: "FLOP",
                isSecondPass: false
            }
        };
        const state: ApplicationState = {
            players: [],
            games: [game]
        };

        const deckSizeBefore = game.deck.length;
        const cardsOnTableSizeBefore = game.cardsOnTable.length;

        handleDealing(game, state, mockPubSubInfo());
        expect(state.games[0].deck).toHaveLength(deckSizeBefore - 3);
        expect(state.games[0].cardsOnTable).toHaveLength(cardsOnTableSizeBefore + 3);
    });

    it("deals the turn", () => {
        const player1 = createPlayer("Tim");
        const [player2, player3] = ["Jill", "Jim"].map(name => createPlayer(name));
        const defaultDeck = makeDeckDefault();

        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]),
            turnToBet: player1.id,
            bettingInfo: {
                round: "TURN",
                isSecondPass: false
            },
            deck: defaultDeck.slice(3),
            cardsOnTable: defaultDeck.slice(0, 3)
        };

        const deckSizeBefore = game.deck.length;
        const cardsOnTableSizeBefore = game.cardsOnTable.length;

        const state: ApplicationState = {
            players: [],
            games: [game]
        };

        handleDealing(game, state, mockPubSubInfo());
        expect(state.games[0].deck).toHaveLength(deckSizeBefore - 1);
        expect(state.games[0].cardsOnTable).toHaveLength(cardsOnTableSizeBefore + 1);
    });
});

describe("handleEndOfRound function", () => {
    it("works as expected when the round ends after the river", () => {
        const player1: Player = { 
            ...createPlayer("Tim"),
            cards: [
                { rank: 4, suit: "SPADES" },
                { rank: 9, suit: "DIAMONDS" },
            ],
            moneyInPot: 50,
            role: "SMALL_BLIND"
        };
        const player2: Player = { 
            ...createPlayer("Jill"),
            cards: [
                { rank: 5, suit: "SPADES" },
                { rank: 6, suit: "DIAMONDS" },
            ],
            moneyInPot: 50,
            role: "BIG_BLIND"
        }; 
        const player3: Player = {
            ...createPlayer("Amedeo"),
            cards: [
                { rank: 10, suit: "SPADES" },
                { rank: 3, suit: "DIAMONDS" },
            ],
            inPlay: false,
            moneyInPot: 25
        };

        const game: Game = { 
            ...createGame(player1), 
            players: [player1].concat([player2, player3]),
            bettingInfo: {
                round: "RIVER",
                isSecondPass: false
            },
            deck: [],
            cardsOnTable: [
                { rank: 2, suit: "HEARTS" },
                { rank: 4, suit: "CLUBS" },
                { rank: 10, suit: "HEARTS" },
                { rank: 1, suit: "DIAMONDS" },
                { rank: 3, suit: "CLUBS" }
            ],
        };

        const state: ApplicationState = {
            players: [],
            games: [game]
        };

        handleEndOfRound(game, state, mockPubSubInfo());
        const gameAfter = state.games[0];
        const winningPlayer = gameAfter.players.find(p => p.id === player2.id);
        if (!winningPlayer) throw new Error("Winning player not found");
        const winningPlayerTotalMoney = winningPlayer.money + winningPlayer.moneyInPot;
        
        expect(winningPlayerTotalMoney).toBe(625);
        
        expect(gameAfter.betAmount).toBe(2 * gameConfig.startingSmallBlind);
        expect(getAmountInPot(gameAfter)).toBe(3 * gameConfig.startingSmallBlind);
        expect(gameAfter.cardsOnTable).toHaveLength(0);
    });
});
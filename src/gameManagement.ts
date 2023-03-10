import { randomUUID } from "crypto";
import { gameConfig } from "./gameConfig";
import { makeDeckDefault } from "./gameplay/cards/cardUtils";
import { Game, Player } from "./types";

export const createPlayer = (name: string): Player => {
    return {
        id: randomUUID(),
        name,
        role: "OTHER",
        cards: [],
        money: gameConfig.startingMoney,
        inPlay: true,
        moneyInPot: 0
    };
};

export const createGame = (player: Player): Game => {
    return {
        id: randomUUID(),
        players: [player],
        turnToBet: player.id,
        deck: makeDeckDefault(),
        cardsOnTable: [],
        pot: 0,
        betAmount: 0,
        started: false
    };
};

export const joinGame = (game: Game, player: Player): Game => {
    return {
        ...game,
        players: game.players.concat(player)
    };
};

export const leaveGame = (game: Game, player: Player): Game => {
    if (!game.players.find(p => p.id === player.id)) {
        throw new Error("Tried to leave game but player not in it");
    }
    return {
        ...game,
        players: game.players.filter(p => p.id !== player.id)
    };
};

export const initialiseRoles = (players: Player[]): Player[] => {
    if (players.length < 2) {
        throw new Error("not enough players");
    }
    if (players.length == 2) {
        return [{ ...players[0], role: "BIG_BLIND" }, { ...players[1], role: "SMALL_BLIND" }];
    }
    return players.map((p, idx) => {
        if (idx === 1) return { ...p, role: "SMALL_BLIND" };
        if (idx === 2) return { ...p, role: "BIG_BLIND" };
        return p;
    });
};
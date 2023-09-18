import WebSocket from "ws";
import { revealCards } from "../../gameplay/cards/dealing";
import { updateGameWithEndOfRound } from "../../gameplay/roundManagement";
import { ApplicationState, Game } from "../../types";
import { publishToPlayers } from "../publishing";

export const handleDealing = (game: Game, applicationState: ApplicationState, pubSubInfo: Map<string, WebSocket>) => {
    console.debug("DEALING");
    const gameUpdated = revealCards(game, game.bettingInfo?.round === "FLOP" ? 3 : 1);

    applicationState.games = applicationState.games
        .map(g => g.id === game.id ? gameUpdated : g);

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players);
};

export const handleEndOfRound = (game: Game, applicationState: ApplicationState, pubSubInfo: Map<string, WebSocket>) => {
    const gameUpdated = updateGameWithEndOfRound(game);

    applicationState.games = applicationState.games
        .map(g => g.id === game.id ? gameUpdated : g);

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players);
};
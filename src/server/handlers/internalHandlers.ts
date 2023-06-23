import WebSocket from "ws";
import { winPot } from "../../gameplay/betting";
import { revealCards } from "../../gameplay/cards/dealing";
import { blindsRound, groupPlayersByScore, prepareForRound, resetAfterRound } from "../../gameplay/roundManagement";
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
    const activePlayersByScore = groupPlayersByScore(game.players.filter(p => p.inPlay), game.cardsOnTable);
    const gameUpdatedWithWinnings = winPot(game, activePlayersByScore);

    const gameUpdated = blindsRound(
        prepareForRound(
            resetAfterRound(gameUpdatedWithWinnings)
        )
    );

    applicationState.games = applicationState.games
        .map(g => g.id === game.id ? gameUpdated : g);

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players);
};
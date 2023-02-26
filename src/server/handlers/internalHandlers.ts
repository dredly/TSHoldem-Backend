import WebSocket from "ws";
import { revealCards } from "../../gameplay/cards/dealing";
import { ApplicationState, Game } from "../../types";
import { publishToPlayers } from "../publishing";

export const handleDealing = (game: Game, applicationState: ApplicationState, pubSubInfo: Map<String, WebSocket>) => {
    console.debug("DEALING")
    const gameUpdated = revealCards(game, game.bettingInfo?.round === "FLOP" ? 3 : 1)

    applicationState.games = applicationState.games
        .map(g => g.id === game.id ? gameUpdated : g)

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players)
}
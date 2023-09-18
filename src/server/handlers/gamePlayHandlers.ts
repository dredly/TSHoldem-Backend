import WebSocket from "ws";
import { updateGameWithNextBet, updateGameWithBetFromPlayerId, updateGameWithFoldFromPlayerId } from "../../gameplay/betting/gameUpdates";
import { BetMessage, ApplicationState, FoldMessage } from "../../types";
import { publishToPlayers } from "../publishing";
import { handleDealing, handleEndOfRound } from "./internalHandlers";

export const handleBet = (message: BetMessage, applicationState: ApplicationState, pubSubInfo: Map<string, WebSocket>) => {
    console.debug(`Player with id ${message.bettingPlayerId} bet $${message.amount}`);

    const game = applicationState.games.find(g => g.players.map(p => p.id).includes(message.bettingPlayerId));
    if (!game) {
        throw new Error("game with that player not found");
    }

    const gameUpdated = updateGameWithBetFromPlayerId(game, message.bettingPlayerId, message.amount);

    if (!gameUpdated.bettingInfo) {
        console.debug("ending round");
        handleEndOfRound(gameUpdated, applicationState, pubSubInfo);
        return;
    }

    if (gameUpdated.bettingInfo.round !== game.bettingInfo?.round) {
        console.debug("moving on to next round");
        handleDealing(gameUpdated, applicationState, pubSubInfo);
        return;
    }

    applicationState.games = applicationState.games
        .map(g => g.id === game.id ? gameUpdated : g);

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players);
};

export const handleFold = (message: FoldMessage, applicationState: ApplicationState, pubSubInfo: Map<string, WebSocket>) => {
    console.debug(`Player with id ${message.foldingPlayerId} folding`);

    const game = applicationState.games.find(g => g.players.map(p => p.id).includes(message.foldingPlayerId));
    if (!game) {
        throw new Error("game with that player not found");
    }

    const gameUpdatedWithFold = updateGameWithFoldFromPlayerId(game, message.foldingPlayerId);

    // check if everyone has now folded except for one player
    if (gameUpdatedWithFold.players.filter(p => p.inPlay).length < 2) {
        console.debug("ending round early");
        handleEndOfRound(gameUpdatedWithFold, applicationState, pubSubInfo);
        return;
    } 

    const gameUpdated = updateGameWithNextBet(gameUpdatedWithFold);

    if (gameUpdated.bettingInfo?.round !== game.bettingInfo?.round) {
        console.debug("moving on to next round");
        handleDealing(gameUpdated, applicationState, pubSubInfo);
        return;
    }

    applicationState.games = applicationState.games
        .map(g => g.id === game.id ? gameUpdated : g);

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players);
};
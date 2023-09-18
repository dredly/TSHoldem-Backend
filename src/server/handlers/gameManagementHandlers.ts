import WebSocket from "ws";
import { createPlayer, createGameFromPlayerId, startGame } from "../../gameManagement";
import { blindsRound, prepareForRound } from "../../gameplay/roundManagement";
import { CreatePlayerMessage, ApplicationState, CreateGameMessage, JoinGameMessage, StartGameMessage } from "../../types";
import { publishServerMessage, publishToPlayers } from "../publishing";

export const handlePlayerCreation = (message: CreatePlayerMessage, applicationState: ApplicationState, ws: WebSocket, pubSubInfo: Map<string, WebSocket>) => {
    const player = createPlayer(message.name);
    applicationState.players = applicationState.players.concat(player);
    
    pubSubInfo.set(player.id, ws);
    publishServerMessage({ player }, ws);
};

export const handleGameCreation = (message: CreateGameMessage, applicationState: ApplicationState, ws: WebSocket) => {
    const game = createGameFromPlayerId(message.creatorId, applicationState);
    applicationState.players = applicationState.players.filter(p => p.id !== message.creatorId);
    applicationState.games = applicationState.games.concat(game);
    
    publishServerMessage({ game }, ws);
};

export const handleJoin = (message: JoinGameMessage, applicationState: ApplicationState, pubSubInfo: Map<string, WebSocket>) => {
    console.debug(`Player with id ${message.playerId} joining game with id ${message.gameId}`);

    const player = applicationState.players.find(p => p.id === message.playerId);
    if (!player) {
        throw new Error("player not found");
    }

    const game = applicationState.games.find(g => g.id === message.gameId);
    if (!game) {
        throw new Error("game not found");
    }

    const gameJoined = { ...game, players: game.players.concat(player) };

    applicationState.players = applicationState.players.filter(p => p.id !== message.playerId);
    applicationState.games = applicationState.games
        .map(g => g.id === message.gameId ? gameJoined : g);

    publishToPlayers({ gameJoined }, pubSubInfo, gameJoined.players);
};

export const handleStart = (message: StartGameMessage, applicationState: ApplicationState, pubSubInfo: Map<string, WebSocket>) => {
    console.debug(`Starting game with id ${message.startingGameId}`);

    const game = applicationState.games.find(g => g.id === message.startingGameId);
    if (!game) {
        throw new Error("game not found");
    }

    const gameStarted = startGame(game);

    applicationState.games = applicationState.games
        .map(g => g.id === message.startingGameId ? gameStarted : g);

    publishToPlayers({ gameStarted }, pubSubInfo, gameStarted.players);

    const gameUpdated = blindsRound(prepareForRound(gameStarted));

    applicationState.games = applicationState.games
        .map(g => g.id === message.startingGameId ? gameUpdated : g);

    publishToPlayers({ gameUpdated }, pubSubInfo, gameUpdated.players);
};
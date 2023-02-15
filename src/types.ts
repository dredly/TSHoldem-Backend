export type Role = 'DEALER' | 'SMALL_BLIND' | 'BIG_BLIND' | 'OTHER'

export interface Player {
    id: String,
    name: String,
    role: Role
}

export interface Game {
    id: String,
    players: Player[]
}

export interface ApplicationState {
    players: Player[]
    games: Game[]
}

export interface CreatePlayerMessage {
    name: String
}

export interface CreateGameMessage {
    playerId: String
}

export interface JoinGameMessage {
    playerId: String
    gameId: String
}

export type ClientMessage = CreatePlayerMessage | CreateGameMessage | JoinGameMessage
export type Role = 'SMALL_BLIND' | 'BIG_BLIND' | 'OTHER'

export interface Player {
    id: String,
    name: String,
    role: Role,
    money: number
}

export interface Game {
    id: String,
    players: Player[],
    pot: number
}

export interface ApplicationState {
    players: Player[]
    games: Game[]
}

export interface GameConfig {
    startingMoney: number
    startingBlind: number
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
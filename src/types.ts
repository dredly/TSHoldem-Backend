export type Role = 'SMALL_BLIND' | 'BIG_BLIND' | 'OTHER'

export type Suit = 'SPADES' | 'HEARTS' | 'DIAMONDS' | 'CLUBS'

export type Hand = 'PAIR' | 'THREE OF A KIND' | 'FOUR OF A KIND' | 'STRAIGHT' | 'FLUSH' | 'HIGH CARD'

export interface HandChecker {
    (cards: Card[]): number | undefined
}

export interface HandEvaluation {
    // handRank refers to the ranking of the type of hand, e.g. straight flush: 0, four of a kind: 1 etc
    handRank: number
    // handValue refers to the value within a hand, e.g. pair of 4s: 4, pair of 3s: 3
    handValue: number
}

export interface Card {
    rank: number,
    suit: Suit
}

export interface Player {
    id: String,
    name: String,
    role: Role,
    cards: Card[]
    money: number,
    moneyInPot: number,
    inPlay: boolean
}

export interface Game {
    id: String,
    players: Player[],
    turnToBet: number,
    deck: Card[],
    cardsOnTable: Card[]
    pot: number,
    betAmount: number
}

export interface ApplicationState {
    players: Player[]
    games: Game[]
}

export interface GameConfig {
    startingMoney: number
    startingBlind: number,
    handRankings: Hand[]
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
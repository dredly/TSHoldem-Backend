export type Role = "SMALL_BLIND" | "BIG_BLIND" | "OTHER";

export type Suit = "SPADES" | "HEARTS" | "DIAMONDS" | "CLUBS";

export type Hand = "PAIR" | "THREE OF A KIND" | "FOUR OF A KIND" | "STRAIGHT" | "FLUSH" | "HIGH CARD";

export type BettingRound = "BLINDS" | "FLOP" | "TURN" | "RIVER";

export interface BettingInfo {
    round: BettingRound
    isSecondPass: boolean
}

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
    id: string,
    name: string,
    role: Role,
    cards: Card[]
    money: number,
    moneyInPot: number,
    inPlay: boolean
}

export interface Game {
    id: string,
    players: Player[],
    turnToBet: string, // the id of the player currently betting
    deck: Card[],
    cardsOnTable: Card[]
    betAmount: number,
    started: boolean,
    round: number,
    bettingInfo?: BettingInfo
}

export interface ApplicationState {
    players: Player[]
    games: Game[]
}

export interface GameConfig {
    startingMoney: number
    startingSmallBlind: number,
    handRankings: Hand[],
    blindIncreases: number[],
    roundsPerBlindIncrease: number
}

export interface CreatePlayerMessage {
    name: string
}

export interface CreateGameMessage {
    creatorId: string
}

export interface JoinGameMessage {
    playerId: string
    gameId: string
}

export interface StartGameMessage {
    startingGameId: string
}

export interface BetMessage {
    bettingPlayerId: string
    amount: number
}

export interface FoldMessage {
    foldingPlayerId: string
}

export type ClientMessage = 
    CreatePlayerMessage | 
    CreateGameMessage | 
    JoinGameMessage | 
    StartGameMessage |
    BetMessage |
    FoldMessage;

export interface PlayerCreatedMessage {
    player: Player
}

export interface GameCreatedMessage {
    game: Game
}

export interface GameJoinedMessage {
    gameJoined: Game
}

export interface GameStartedMessage {
    gameStarted: Game
}

export interface GameUpdatedMessage {
    gameUpdated: Game
}

export type ServerMessage = 
    PlayerCreatedMessage | 
    GameCreatedMessage | 
    GameJoinedMessage |
    GameStartedMessage |
    GameUpdatedMessage;
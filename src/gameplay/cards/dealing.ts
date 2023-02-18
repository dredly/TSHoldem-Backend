import { Card, Game, Player } from "../../types"

export const takeCardsFromDeck = (deck: Card[], numCards: number): { updatedDeck: Card[], cardsTaken: Card[] } => {
    return {
        updatedDeck: deck.slice(numCards),
        cardsTaken: deck.slice(0, numCards)
    }
}

export const dealToPlayers = (cards: Card[], players: Player[]): Player[] => {
    if (cards.length !== players.length * 2) {
        throw new Error("Cannot split cards evenly between players")
    }
    return players.map((p, idx) => ({ ...p, cards: p.cards.concat(cards.slice(2 * idx, 2 * idx + 2)) }))
}

export const dealRound = (game: Game): Game => {
    const { updatedDeck, cardsTaken } = takeCardsFromDeck(game.deck, 2 * game.players.length)
    return {
        ...game,
        deck: updatedDeck,
        players: dealToPlayers(cardsTaken, game.players)
    }
}
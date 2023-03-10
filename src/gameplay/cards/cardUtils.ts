import { Card, Suit } from "../../types";

export const rankNameMapping = new Map<number, string>([
    [0, "Two"],
    [1, "Three"],
    [2, "Four"],
    [3, "Five"],
    [4, "Six"],
    [5, "Seven"],
    [6, "Eight"],
    [7, "Nine"],
    [8, "Ten"],
    [9, "Jack"],
    [10, "Queen"],
    [11, "King"],
    [12, "Ace"],
]);

export const defaultRanks: number[] = [ ...rankNameMapping.keys() ];
export const defaultSuits: Suit[] = ["SPADES", "DIAMONDS", "CLUBS", "HEARTS"];

export const getRankName = (rank: number, mapping: Map<number, string>): string => {
    const rankName = mapping.get(rank);
    if (!rankName) throw new Error("No name for that rank");
    return rankName;
};

export const getCardName = (card: Card, mapping: Map<number, string>): string => {
    return getRankName(card.rank, mapping) + " of " + card.suit.substring(0, 1) + card.suit.substring(1).toLowerCase();
};

export const makeDeck = (ranks: number[], suits: Suit[]): Card[] => {
    return ranks.flatMap(rank => suits.map(suit => ({ rank, suit })));
};

export const makeDeckDefault = () => {
    return makeDeck(defaultRanks, defaultSuits);
};

export const countCardsOfRank = (rank: number, cards: Card[]): number => {
    return cards.filter(c => c.rank === rank).length;
};

export const countCardsOfSuit = (suit: Suit, cards: Card[]): number => {
    return cards.filter(c => c.suit === suit).length;
};
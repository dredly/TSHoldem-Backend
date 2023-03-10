import { compareHandEvaluations, getLeftoversFromValue, getLeftoversFromCompondValue, compareByHighCards, compareHands } from "../../../gameplay/cards/handComparison";
import { HandEvaluation, Card } from "../../../types";

describe("compareHandEvaluations function", () => {
    it("returns 1 when the first evaluation is 'better' based on handRank", () => {
        const evaluations: HandEvaluation[] = [
            { handRank: 3, handValue: 4 },
            { handRank: 5, handValue: 6 } 
        ];
        expect(compareHandEvaluations(evaluations[0], evaluations[1])).toBe(1); 
    });

    it("returns -1 when the first evaluation is 'worse' based on handValue", () => {
        const evaluations: HandEvaluation[] = [
            { handRank: 3, handValue: 4 },
            { handRank: 3, handValue: 6 } 
        ];
        expect(compareHandEvaluations(evaluations[0], evaluations[1])).toBe(-1); 
    });

    it("returns 0 when the evaluations are the same", () => {
        const evaluations: HandEvaluation[] = [
            { handRank: 3, handValue: 4 },
            { handRank: 3, handValue: 4 } 
        ];
        expect(compareHandEvaluations(evaluations[0], evaluations[1])).toBe(0); 
    });
});

describe("getLeftoversFromValue function", () => {
    it("returns the expected leftover cards for 3 of a kind", () => {
        const cards: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "DIAMONDS" },
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 9, suit: "SPADES" }
        ];
        const expectedLeftovers: Card[] = [
            { rank: 1, suit: "CLUBS" },
            { rank: 9, suit: "SPADES" }
        ];
        expect(getLeftoversFromValue(cards, 2)).toEqual(expectedLeftovers);
    });

    it("returns the expected leftover cards for a high card", () => {
        const cards: Card[] = [
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
            { rank: 9, suit: "SPADES" }
        ];
        const expectedLeftovers: Card[] = [
            { rank: 2, suit: "HEARTS" },
            { rank: 1, suit: "CLUBS" },
        ];
        expect(getLeftoversFromValue(cards, 9)).toEqual(expectedLeftovers);
    });
});

describe("getLeftoversFromCompoundValue function", () => {
    it("returns the expected leftover cards for 2 pairs", () => {
        const cards: Card[] = [
            { rank: 7, suit: "HEARTS" },
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 3, suit: "SPADES" },
        ];
        const expectedLeftovers: Card[] = [
            { rank: 4, suit: "CLUBS" }
        ];
        expect(getLeftoversFromCompondValue(cards, 7.03)).toEqual(expectedLeftovers);
    });
});

describe("compareByHighCards function", () => {
    it("returns 0 when both hands have same high cards", () => {
        const hand1: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
        ];
        const hand2: Card[] = [
            { rank: 4, suit: "HEARTS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "SPADES" },
        ];
        expect(compareByHighCards(hand1, hand2)).toBe(0);
    });

    it("works when highest card is different", () => {
        const hand1: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
        ];
        const hand2: Card[] = [
            { rank: 4, suit: "HEARTS" },
            { rank: 8, suit: "DIAMONDS" },
            { rank: 3, suit: "SPADES" },
        ];
        expect(compareByHighCards(hand1, hand2)).toBe(-1);
    });

    it("works when lowest card is different", () => {
        const hand1: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
        ];
        const hand2: Card[] = [
            { rank: 4, suit: "HEARTS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 2, suit: "SPADES" },
        ];
        expect(compareByHighCards(hand1, hand2)).toBe(1);
    });
});

describe("compareHands function", () => {
    it("works as expected for 2 hands of different rank", () => {
        const hand1: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "SPADES" },
            { rank: 0, suit: "HEARTS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 7, suit: "HEARTS" },
            { rank: 5, suit: "HEARTS" },
        ];
        const hand2: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 7, suit: "SPADES" },
            { rank: 0, suit: "HEARTS" },
            { rank: 6, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 9, suit: "CLUBS" },
            { rank: 5, suit: "HEARTS" },
        ];
        expect(compareHands(hand1, hand2)).toBe(-1);
    });

    it("works as expected for 2 hands of same rank but different value", () => {
        const hand1: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 0, suit: "HEARTS" },
            { rank: 7, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 7, suit: "HEARTS" },
            { rank: 5, suit: "HEARTS" },
        ];
        const hand2: Card[] = [
            { rank: 4, suit: "CLUBS" },
            { rank: 0, suit: "HEARTS" },
            { rank: 4, suit: "DIAMONDS" },
            { rank: 3, suit: "HEARTS" },
            { rank: 7, suit: "HEARTS" },
            { rank: 5, suit: "HEARTS" },
        ];
        expect(compareHands(hand1, hand2)).toBe(1);
    });

    it("returns 0 for 2 equivalent hands of lenght 5, even if there are different high cards outside of this", () => {
        const hand1: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "SPADES" },
            { rank: 4, suit: "HEARTS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 6, suit: "HEARTS" },
            { rank: 9, suit: "HEARTS" },
            { rank: 10, suit: "HEARTS" },
        ];
        const hand2: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 3, suit: "SPADES" },
            { rank: 4, suit: "HEARTS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 6, suit: "HEARTS" },
            { rank: 9, suit: "HEARTS" },
            { rank: 12, suit: "HEARTS" },
        ];
        expect(compareHands(hand1, hand2)).toBe(0);
    });

    it("returns 0 for 2 equivalent 3 of a kinds if the next 2 high cards are also the same", () => {
        const hand1: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "SPADES" },
            { rank: 2, suit: "HEARTS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 6, suit: "HEARTS" },
            { rank: 9, suit: "HEARTS" },
            { rank: 10, suit: "HEARTS" },
        ];
        const hand2: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "SPADES" },
            { rank: 2, suit: "HEARTS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 7, suit: "HEARTS" },
            { rank: 9, suit: "HEARTS" },
            { rank: 10, suit: "HEARTS" },
        ];
        expect(compareHands(hand1, hand2)).toBe(0);
    });

    it("resolves a tie between 2 pairs by high card", () => {
        const hand1: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "SPADES" },
            { rank: 4, suit: "HEARTS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 6, suit: "HEARTS" },
            { rank: 8, suit: "HEARTS" },
            { rank: 10, suit: "HEARTS" },
        ];
        const hand2: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "SPADES" },
            { rank: 0, suit: "HEARTS" },
            { rank: 5, suit: "DIAMONDS" },
            { rank: 7, suit: "HEARTS" },
            { rank: 9, suit: "HEARTS" },
            { rank: 10, suit: "HEARTS" },
        ];
        expect(compareHands(hand1, hand2)).toBe(-1);
    });

    it("resolves a tie between 2 equivalent 2 pair by high card", () => {
        const hand1: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "SPADES" },
            { rank: 4, suit: "HEARTS" },
            { rank: 4, suit: "DIAMONDS" },
            { rank: 6, suit: "HEARTS" },
            { rank: 8, suit: "HEARTS" },
            { rank: 10, suit: "HEARTS" },
        ];
        const hand2: Card[] = [
            { rank: 2, suit: "CLUBS" },
            { rank: 2, suit: "SPADES" },
            { rank: 4, suit: "HEARTS" },
            { rank: 4, suit: "DIAMONDS" },
            { rank: 7, suit: "HEARTS" },
            { rank: 9, suit: "HEARTS" },
            { rank: 11, suit: "HEARTS" },
        ];
        expect(compareHands(hand1, hand2)).toBe(-1);
    });
});
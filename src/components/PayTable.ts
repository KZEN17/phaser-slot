import SymbolObject from './Symbol';
import { Win } from '../types';

export default class PayTable {
    private payLines: number[][];

    constructor() {
        // Define the pay lines (for a 3x3 slot)
        // Each array represents indexes of symbols to check for a line
        // [0,1,2] = top row, [3,4,5] = middle row, [6,7,8] = bottom row
        this.payLines = [
            [0, 1, 2],  // Top horizontal
            [3, 4, 5],  // Middle horizontal
            [6, 7, 8],  // Bottom horizontal
            [0, 4, 8],  // Diagonal from top-left
            [6, 4, 2]   // Diagonal from bottom-left
        ];
    }

    /**
     * Calculate wins based on the current symbols
     * @param visibleSymbols All visible symbols on the reels
     * @param bet Current bet amount
     * @returns Array of win information
     */
    public calculateWins(visibleSymbols: SymbolObject[], bet: number): Win[] {
        const wins: Win[] = [];

        // Check each pay line
        for (let i = 0; i < this.payLines.length; i++) {
            const line = this.payLines[i];

            // Get the symbols on this line
            const lineSymbols = line.map(index => visibleSymbols[index]);

            // Check if all symbols are the same
            if (this.checkLine(lineSymbols)) {
                // Calculate win amount based on symbol value
                const symbolValue = lineSymbols[0].getValue();
                const winAmount = bet * symbolValue;

                wins.push({
                    line: i,
                    symbols: lineSymbols,
                    amount: winAmount
                });
            }
        }

        return wins;
    }

    /**
     * Check if all symbols in a line are the same
     * @param symbols Array of symbols to check
     * @returns Whether all symbols are the same
     */
    private checkLine(symbols: SymbolObject[]): boolean {
        if (!symbols.length) return false;

        const firstType = symbols[0].type;
        return symbols.every(symbol => symbol.type === firstType);
    }

    /**
     * Get all pay lines for visualization
     * @returns Array of pay line definitions
     */
    public getPayLines(): number[][] {
        return this.payLines;
    }
}
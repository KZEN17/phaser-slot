import Phaser from 'phaser';
import Symbol from './Symbol';
import { SYMBOLS, SYMBOL_HEIGHT } from '../config';

export default class Reel {
    private scene: Phaser.Scene;
    private x: number;
    private y: number;
    private symbolCount: number;
    public symbols: Symbol[];
    private symbolHeight: number;
    public spinning: boolean;
    private nextSymbols: string[];
    private mask: Phaser.GameObjects.Graphics;

    // Callback for when reel stops spinning
    public onReelStop?: (reel: Reel) => void;

    constructor(scene: Phaser.Scene, x: number, y: number, symbolCount: number = 3) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.symbolCount = symbolCount;
        this.symbolHeight = SYMBOL_HEIGHT;
        this.symbols = [];
        this.spinning = false;
        this.nextSymbols = [];

        // Create mask for the reel (to hide symbols outside the view)
        this.mask = this.scene.add.graphics();
        this.mask.fillStyle(0xffffff);
        this.mask.fillRect(x - 50, y - this.symbolHeight * 1.5, 100, this.symbolHeight * symbolCount);

        // Create initial symbols
        this.createSymbols();
    }

    /**
     * Create initial symbols for the reel
     */
    private createSymbols(): void {
        // Create one extra symbol above and below for smooth scrolling
        const totalSymbols = this.symbolCount + 2;

        for (let i = 0; i < totalSymbols; i++) {
            // Randomly select a symbol type
            const randomType = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

            // Calculate y position (centered with offset for extra symbols)
            const yPos = this.y + (i - Math.floor(totalSymbols / 2)) * this.symbolHeight;

            // Create the symbol
            const symbol = new Symbol(this.scene, this.x, yPos, randomType);
            symbol.sprite.setMask(new Phaser.Display.Masks.GeometryMask(this.scene, this.mask));

            this.symbols.push(symbol);
        }
    }

    /**
     * Start spinning the reel
     * @returns {boolean} Whether the spin was started
     */
    public spin(): boolean {
        if (this.spinning) return false;

        this.spinning = true;

        // Determine where the reel will stop
        this.determineOutcome();

        // Tween to create spinning effect
        this.scene.tweens.add({
            targets: this.symbols.map(s => s.sprite),
            y: `+=${this.symbolHeight * (this.symbols.length - 2)}`,
            duration: 1500 + Math.random() * 500, // Slightly randomize duration
            ease: 'Cubic.easeInOut',
            onComplete: () => this.onSpinComplete()
        });

        return true;
    }

    /**
     * Determine the final outcome of the spin
     */
    private determineOutcome(): void {
        // In a real casino game, this would be determined by the server
        // For our example, we'll just randomize

        // Prepare symbol positions for next spin
        const newSymbols: string[] = [];

        for (let i = 0; i < this.symbols.length; i++) {
            // Randomly select a symbol type
            const randomType = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

            // Store the symbol type to be set after spinning
            newSymbols.push(randomType);
        }

        this.nextSymbols = newSymbols;
    }

    /**
     * Called when spinning is complete
     */
    private onSpinComplete(): void {
        // Reset symbol positions
        for (let i = 0; i < this.symbols.length; i++) {
            const yPos = this.y + (i - Math.floor(this.symbols.length / 2)) * this.symbolHeight;
            this.symbols[i].sprite.y = yPos;

            // Update symbol type
            this.symbols[i].setTexture(this.nextSymbols[i]);
        }

        this.spinning = false;

        // Let the slot machine know this reel has stopped
        if (this.onReelStop) {
            this.onReelStop(this);
        }
    }

    /**
     * Returns the visible symbols (for win calculation)
     * @returns {Symbol[]} Array of visible symbols
     */
    public getVisibleSymbols(): Symbol[] {
        // We want the middle symbols (excluding the extra ones)
        const visibleSymbols: Symbol[] = [];
        for (let i = 1; i <= this.symbolCount; i++) {
            visibleSymbols.push(this.symbols[i]);
        }
        return visibleSymbols;
    }
}
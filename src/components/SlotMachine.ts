import Phaser from 'phaser';
import Reel from './Reel';
import PayTable from './PayTable';
import SymbolObject from './Symbol';
import { Win } from '../types';
import {
    REEL_COUNT,
    SYMBOLS_PER_REEL,
    SYMBOL_WIDTH,
    REEL_SPACING,
    DEFAULT_BET,
    MIN_BET,
    MAX_BET,
    BET_INCREMENT,
    STARTING_CREDITS
} from '../config';

export default class SlotMachine {
    private scene: Phaser.Scene;
    private x: number;
    private y: number;

    // Game components
    private reels: Reel[];
    private payTable: PayTable;

    // Game state
    private spinning: boolean;
    private reelsSpinning: number;
    private credits: number;
    private bet: number;

    // UI elements
    private creditText!: Phaser.GameObjects.Text;
    private betText!: Phaser.GameObjects.Text;
    private winText!: Phaser.GameObjects.Text;
    private spinButton!: Phaser.GameObjects.Image;
    private spinText!: Phaser.GameObjects.Text;
    private betMinusButton!: Phaser.GameObjects.Image;
    private betPlusButton!: Phaser.GameObjects.Image;
    private betMinusText!: Phaser.GameObjects.Text;
    private betPlusText!: Phaser.GameObjects.Text;

    // Sounds
    private spinSound: Phaser.Sound.BaseSound;
    private winSound: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // Game state initialization
        this.reels = [];
        this.spinning = false;
        this.reelsSpinning = 0;
        this.credits = STARTING_CREDITS;
        this.bet = DEFAULT_BET;

        // Create the pay table
        this.payTable = new PayTable();

        // Create UI elements
        this.createUI();

        // Create reels
        this.createReels();

        // Load sounds
        this.spinSound = this.scene.sound.add('spin');
        this.winSound = this.scene.sound.add('win');

        // Update credit display
        this.updateCredits();
        this.updateBet();
    }

    /**
     * Create the UI elements
     */
    private createUI(): void {
        // Add background
        this.scene.add.image(this.x, this.y, 'background')
            .setDisplaySize(800, 600);

        // Create credit display - position higher up
        this.creditText = this.scene.add.text(this.x, this.y - 220, 'CREDITS: 1000', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create bet display - position higher up but below credits
        this.betText = this.scene.add.text(this.x, this.y - 180, 'BET: 10', {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create win display - move below the reels
        this.winText = this.scene.add.text(this.x, this.y + 170, '', {
            fontSize: '32px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create spin button - move further down
        this.spinButton = this.scene.add.image(this.x, this.y + 240, 'button')
            .setInteractive()
            .setScale(1.2);

        this.spinText = this.scene.add.text(this.x, this.y + 240, 'SPIN', {
            fontSize: '24px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add button event
        this.spinButton.on('pointerdown', () => {
            this.spin();
        });

        // Create bet controls - reposition and make smaller
        this.betMinusButton = this.scene.add.image(this.x - 150, this.y + 240, 'button')
            .setInteractive()
            .setScale(0.7);

        this.betPlusButton = this.scene.add.image(this.x + 150, this.y + 240, 'button')
            .setInteractive()
            .setScale(0.7);

        this.betMinusText = this.scene.add.text(this.x - 150, this.y + 240, '-', {
            fontSize: '28px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.betPlusText = this.scene.add.text(this.x + 150, this.y + 240, '+', {
            fontSize: '28px',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add bet button events
        this.betMinusButton.on('pointerdown', () => {
            this.decreaseBet();
        });

        this.betPlusButton.on('pointerdown', () => {
            this.increaseBet();
        });
    }

    /**
     * Create the reels
     */
    private createReels(): void {
        // Add a frame for the slot machine before creating reels
        const frameWidth = (REEL_COUNT * SYMBOL_WIDTH) + ((REEL_COUNT + 1) * REEL_SPACING) + 40;
        const frameHeight = (SYMBOLS_PER_REEL) + 40;

        // Add background frame
        this.scene.add.image(this.x, this.y, 'frame')
            .setDisplaySize(frameWidth, frameHeight);

        // Calculate positions
        const startX = this.x - ((REEL_COUNT - 1) * (SYMBOL_WIDTH + REEL_SPACING)) / 2;

        // Create each reel
        for (let i = 0; i < REEL_COUNT; i++) {
            const reelX = startX + i * (SYMBOL_WIDTH + REEL_SPACING);
            const reel = new Reel(this.scene, reelX, this.y, SYMBOLS_PER_REEL);

            // Set callback for when reel stops
            reel.onReelStop = this.handleReelStop.bind(this);

            this.reels.push(reel);
        }
    }

    /**
     * Handle when a reel stops spinning
     */
    private handleReelStop(_reel: Reel): void {
        this.reelsSpinning--;

        // If all reels have stopped
        if (this.reelsSpinning === 0) {
            this.spinning = false;
            this.checkWin();
            this.enableUI(true);
        }
    }

    /**
     * Start spinning the reels
     */
    public spin(): void {
        // Don't allow spin if already spinning or not enough credits
        if (this.spinning || this.credits < this.bet) {
            return;
        }

        // Clear any previous wins
        this.winText.setText('');

        // Deduct bet from credits
        this.credits -= this.bet;
        this.updateCredits();

        // Disable UI during spin
        this.enableUI(false);

        // Start spinning all reels
        this.spinning = true;
        this.reelsSpinning = this.reels.length;

        // Play spin sound
        this.spinSound.play();

        // Start each reel with a slight delay
        this.reels.forEach((reel, i) => {
            this.scene.time.delayedCall(i * 200, () => {
                reel.spin();
            });
        });
    }

    /**
     * Check for wins after reels stop
     */
    private checkWin(): void {
        // Get all visible symbols
        const visibleSymbols: SymbolObject[] = [];

        this.reels.forEach(reel => {
            visibleSymbols.push(...reel.getVisibleSymbols());
        });

        // Calculate wins
        const wins = this.payTable.calculateWins(visibleSymbols, this.bet);

        if (wins.length > 0) {
            // Play win sound
            this.winSound.play();

            // Calculate total win amount
            const totalWin = wins.reduce((sum, win) => sum + win.amount, 0);

            // Add to credits
            this.credits += totalWin;
            this.updateCredits();

            // Show win amount
            this.winText.setText(`WIN: ${totalWin}`);

            // Highlight winning symbols
            this.highlightWins(wins);
        }
    }

    /**
     * Highlight winning symbols
     */
    private highlightWins(wins: Win[]): void {
        wins.forEach(win => {
            win.symbols.forEach(symbol => {
                symbol.highlight();
            });
        });
    }

    /**
     * Update the credit display
     */
    private updateCredits(): void {
        this.creditText.setText(`CREDITS: ${this.credits}`);
    }

    /**
     * Update the bet display
     */
    private updateBet(): void {
        this.betText.setText(`BET: ${this.bet}`);
    }

    /**
     * Increase the bet amount
     */
    private increaseBet(): void {
        if (this.spinning) return;

        this.bet = Math.min(this.bet + BET_INCREMENT, MAX_BET);
        this.updateBet();
    }

    /**
     * Decrease the bet amount
     */
    private decreaseBet(): void {
        if (this.spinning) return;

        this.bet = Math.max(this.bet - BET_INCREMENT, MIN_BET);
        this.updateBet();
    }

    /**
     * Enable or disable UI elements during spin
     */
    private enableUI(enabled: boolean): void {
        this.spinButton.setAlpha(enabled ? 1 : 0.5);

        this.betMinusButton.setAlpha(enabled ? 1 : 0.5);
        this.betPlusButton.setAlpha(enabled ? 1 : 0.5);

        if (enabled) {
            this.spinButton.setInteractive();
            this.betMinusButton.setInteractive();
            this.betPlusButton.setInteractive();
        } else {
            this.spinButton.disableInteractive();
            this.betMinusButton.disableInteractive();
            this.betPlusButton.disableInteractive();
        }
    }
}
import Phaser from 'phaser';
import { SymbolValues } from '../types';
import { SYMBOL_VALUES } from '../config'; // Import from config instead of types

export default class Symbol {
    private scene: Phaser.Scene;
    public sprite: Phaser.GameObjects.Sprite;
    public type: string;
    private values: SymbolValues;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, texture);
        this.sprite.setScale(0.6); // Scale down the symbol to fit

        // Store the symbol type (for win calculations)
        this.type = texture;

        // Define value multipliers for each symbol type
        this.values = SYMBOL_VALUES;
    }

    /**
     * Get the value multiplier for this symbol
     */
    public getValue(): number {
        return this.values[this.type] || 0;
    }

    /**
     * Update the symbol texture
     */
    public setTexture(texture: string): void {
        this.type = texture;
        this.sprite.setTexture(texture);
    }

    /**
     * Highlight the symbol (for win lines)
     */
    public highlight(): void {
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 0.75,
            scaleY: 0.75,
            duration: 300,
            yoyo: true,
            repeat: 3
        });
    }
}
import Phaser from 'phaser';
import { SYMBOLS } from '../config';

export default class BootScene extends Phaser.Scene {
    private loadingBar!: Phaser.GameObjects.Graphics;
    private progressBar!: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'BootScene' });
    }
    preload(): void {
        // Create loading bar
        this.createLoadingBar();

        // Load the preload asset pack
        this.load.pack("preload", "assets/preload-asset-pack.json");

        // Fallback to placeholders if needed
        this.load.once('complete', () => {
            this.loadPlaceholders();
        });
    }

    create(): void {
        this.scene.start('SlotScene');
    }

    private createLoadingBar(): void {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.loadingBar = this.add.graphics();
        this.progressBar = this.add.graphics();

        // Loading box
        this.loadingBar.fillStyle(0x222222, 0.8);
        this.loadingBar.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        // Loading text
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                color: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        // Update progress bar as assets load
        this.load.on('progress', (value: number) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        // Clean up when loading complete
        this.load.on('complete', () => {
            this.progressBar.destroy();
            this.loadingBar.destroy();
            loadingText.destroy();
        });
    }

    private loadPlaceholders(): void {
        // Check if symbol assets exist, if not load placeholders
        SYMBOLS.forEach((symbol) => {
            const key = symbol;
            if (!this.textures.exists(key)) {
                // For development: use placeholder OpenGameArt assets
                if (symbol === 'symbol1') {
                    this.load.image(key, 'https://opengameart.org/sites/default/files/styles/medium/public/cherry_0.png');
                } else if (symbol === 'symbol2') {
                    this.load.image(key, 'https://opengameart.org/sites/default/files/styles/medium/public/bell_0.png');
                } else if (symbol === 'symbol3') {
                    this.load.image(key, 'https://opengameart.org/sites/default/files/styles/medium/public/seven_0.png');
                } else if (symbol === 'symbol4') {
                    this.load.image(key, 'https://opengameart.org/sites/default/files/styles/medium/public/watermelon_0.png');
                } else if (symbol === 'symbol5') {
                    this.load.image(key, 'https://opengameart.org/sites/default/files/styles/medium/public/diamond_0.png');
                }
            }
        });

        // Check UI assets and load placeholders if needed
        if (!this.textures.exists('button')) {
            this.load.image('button', 'https://examples.phaser.io/assets/ui/blue_button01.png');
        }

        if (!this.textures.exists('background')) {
            this.load.image('background', 'https://examples.phaser.io/assets/skies/nebula.jpg');
        }

        // Start another loading phase if we added placeholders
        if (this.load.list.size > 0) {
            this.load.start();
        }
    }
}
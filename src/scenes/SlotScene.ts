import Phaser from 'phaser';
import SlotMachine from '../components/SlotMachine';

export default class SlotScene extends Phaser.Scene {
    private slotMachine!: SlotMachine;

    constructor() {
        super({ key: 'SlotScene' });
    }

    create(): void {
        // Get the center of the screen
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Create the slot machine
        this.slotMachine = new SlotMachine(this, centerX, centerY);

        // Add some instructions
        const instructions = this.add.text(10, 10,
            'Use + and - to change bet. Click SPIN to play.\nMatch symbols on paylines to win!', {
            fontSize: '16px',
            color: '#ffffff'
        });

        // Add responsive handling
        this.scale.on('resize', this.resize, this);
        this.resize();
    }

    /**
     * Handle window resize events
     */
    private resize(): void {
        // Get new dimensions
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // You could add additional resize handling here
        // For example, repositioning UI elements based on the new size
    }
}
import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import SlotScene from './scenes/SlotScene';


export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#2c003e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, SlotScene],
    physics: {
        default: 'arcade',
        arcade: {

            debug: false
        }
    }
};

// Game constants
export const REEL_COUNT = 3;
export const SYMBOLS_PER_REEL = 3;
export const SYMBOL_HEIGHT = 100;
export const SYMBOL_WIDTH = 80;
export const REEL_SPACING = 10;

// Default bet values
export const DEFAULT_BET = 10;
export const MIN_BET = 1;
export const MAX_BET = 100;
export const BET_INCREMENT = 5;
export const STARTING_CREDITS = 1000;

// Symbol definitions
export const SYMBOLS = [
    'symbol1', // Cherry
    'symbol2', // Bell
    'symbol3', // Seven
    'symbol4', // Watermelon
    'symbol5'  // Diamond
];

// Symbol values
export const SYMBOL_VALUES = {
    'symbol1': 1,  // Cherry
    'symbol2': 2,  // Bell
    'symbol3': 5,  // Seven
    'symbol4': 3,  // Watermelon
    'symbol5': 10  // Diamond
};
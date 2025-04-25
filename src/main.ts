import Phaser from 'phaser';
import { GameConfig } from './config';

window.addEventListener('load', () => {
	// Create our game instance
	const game = new Phaser.Game(GameConfig);

	// Handle window resize
	window.addEventListener('resize', () => {
		if (game.isBooted) {
			game.scale.refresh();
		}
	});
});
import { GameController } from './controller.js';

/**
 * Main entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game controller
    const gameController = new GameController();
    
    // Store controller globally for debugging
    window.gameController = gameController;
});

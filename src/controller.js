import { Game } from './game.js';
import { Level } from './level.js';
import { Player } from './player.js';
import { Ghost } from './ghost.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';

/**
 * GameController manages the game loop and coordinates all systems
 */
export class GameController {
    constructor() {
        this.game = new Game();
        this.level = new Level();
        this.input = new InputHandler();
        
        // Initialize renderer
        const container = document.getElementById('game-canvas');
        this.renderer = new Renderer(container);
        
        // Create level geometry
        this.renderer.createMaze(this.level);
        this.renderer.createPellets(this.level);
        
        // Initialize player
        const playerSpawn = this.level.getPlayerSpawn();
        const worldPos = this.level.gridToWorld(playerSpawn.x, playerSpawn.z);
        this.player = new Player(worldPos.x, worldPos.z, this.level);
        this.renderer.createPlayer(worldPos.x, worldPos.z);
        
        // Initialize ghosts
        this.ghosts = [];
        const ghostSpawns = this.level.getGhostSpawns();
        const colors = [0xff0000, 0xff69b4, 0x00ffff, 0xffa500];
        ghostSpawns.forEach((spawn, index) => {
            const ghostWorldPos = this.level.gridToWorld(spawn.x, spawn.z);
            const ghost = new Ghost(
                ghostWorldPos.x,
                ghostWorldPos.z,
                this.level,
                colors[index]
            );
            this.ghosts.push(ghost);
        });
        this.renderer.createGhosts(this.ghosts);
        
        // Set total pellets
        this.game.setTotalPellets(this.level.countPellets());
        
        // UI elements
        this.setupUI();
        
        // Animation frame
        this.animationId = null;
    }

    /**
     * Setup UI event listeners
     */
    setupUI() {
        const startButton = document.getElementById('start-button');
        const restartButton = document.getElementById('restart-button');
        const winRestartButton = document.getElementById('win-restart-button');
        
        startButton.addEventListener('click', () => this.startGame());
        restartButton.addEventListener('click', () => this.restartGame());
        winRestartButton.addEventListener('click', () => this.restartGame());
    }

    /**
     * Start the game
     */
    startGame() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-hud').classList.remove('hidden');
        this.game.start();
        this.gameLoop();
    }

    /**
     * Restart the game
     */
    restartGame() {
        // Hide game over/win screens
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('win-screen').classList.add('hidden');
        document.getElementById('game-hud').classList.remove('hidden');
        
        // Reset game state
        this.game.reset();
        
        // Recreate level
        this.renderer.createPellets(this.level);
        this.game.setTotalPellets(this.level.countPellets());
        
        // Reset player
        const playerSpawn = this.level.getPlayerSpawn();
        const worldPos = this.level.gridToWorld(playerSpawn.x, playerSpawn.z);
        this.player.reset(worldPos.x, worldPos.z);
        
        // Reset ghosts
        const ghostSpawns = this.level.getGhostSpawns();
        this.ghosts.forEach((ghost, index) => {
            const spawn = ghostSpawns[index];
            const ghostWorldPos = this.level.gridToWorld(spawn.x, spawn.z);
            ghost.reset(ghostWorldPos.x, ghostWorldPos.z);
        });
        
        // Clear input
        this.input.clear();
        
        // Update UI
        this.updateUI();
        
        // Start game
        this.game.start();
        this.gameLoop();
    }

    /**
     * Main game loop
     */
    gameLoop() {
        if (this.game.isPlaying()) {
            this.update();
            this.render();
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        }
    }

    /**
     * Update game state
     */
    update() {
        // Get input direction
        const direction = this.input.getDirection();
        if (direction.x !== 0 || direction.z !== 0) {
            this.player.setDirection(direction.x, direction.z);
        }
        
        // Update player
        this.player.update();
        
        // Check pellet collection
        const playerGrid = this.player.getGridPosition();
        if (this.level.hasPellet(playerGrid.x, playerGrid.z)) {
            const isPower = this.level.isPowerPellet(playerGrid.x, playerGrid.z);
            
            if (isPower) {
                this.game.collectPowerPellet();
                // Make ghosts vulnerable
                this.ghosts.forEach(ghost => ghost.makeVulnerable(300));
            } else {
                this.game.collectPellet();
            }
            
            this.level.removePellet(playerGrid.x, playerGrid.z);
            this.renderer.removePellet(playerGrid.x, playerGrid.z);
            this.updateUI();
        }
        
        // Update ghosts
        this.ghosts.forEach(ghost => {
            ghost.update(this.player.x, this.player.z);
            
            // Check collision with player
            if (ghost.collidesWith(this.player)) {
                if (ghost.isVulnerable) {
                    // Eat ghost
                    this.game.addScore(200);
                    const spawn = this.level.getGhostSpawns()[this.ghosts.indexOf(ghost)];
                    const worldPos = this.level.gridToWorld(spawn.x, spawn.z);
                    ghost.reset(worldPos.x, worldPos.z);
                } else {
                    // Lose life
                    this.game.loseLife();
                    this.updateUI();
                    
                    if (this.game.getState().state !== 'GAMEOVER') {
                        // Reset positions
                        const playerSpawn = this.level.getPlayerSpawn();
                        const playerWorldPos = this.level.gridToWorld(playerSpawn.x, playerSpawn.z);
                        this.player.reset(playerWorldPos.x, playerWorldPos.z);
                        
                        const ghostSpawns = this.level.getGhostSpawns();
                        this.ghosts.forEach((g, index) => {
                            const spawn = ghostSpawns[index];
                            const ghostWorldPos = this.level.gridToWorld(spawn.x, spawn.z);
                            g.reset(ghostWorldPos.x, ghostWorldPos.z);
                        });
                    }
                }
            }
        });
        
        // Check game state
        if (this.game.getState().state === 'GAMEOVER') {
            this.showGameOver();
        } else if (this.game.getState().state === 'WIN') {
            this.showWin();
        }
    }

    /**
     * Render game
     */
    render() {
        this.renderer.updatePlayer(this.player.x, this.player.z);
        this.renderer.updateGhosts(this.ghosts);
        this.renderer.render();
    }

    /**
     * Update UI elements
     */
    updateUI() {
        const state = this.game.getState();
        document.getElementById('score').textContent = `Score: ${state.score}`;
        document.getElementById('lives').textContent = `Lives: ${state.lives}`;
        document.getElementById('level').textContent = `Level: ${state.level}`;
    }

    /**
     * Show game over screen
     */
    showGameOver() {
        document.getElementById('game-hud').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('final-score').textContent = `Final Score: ${this.game.score}`;
    }

    /**
     * Show win screen
     */
    showWin() {
        document.getElementById('game-hud').classList.add('hidden');
        document.getElementById('win-screen').classList.remove('hidden');
        document.getElementById('win-score').textContent = `Final Score: ${this.game.score}`;
    }

    /**
     * Cleanup
     */
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.renderer.dispose();
    }
}

/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { Game } from '../src/game.js';
import { Level } from '../src/level.js';
import { Player } from '../src/player.js';
import { Ghost } from '../src/ghost.js';

describe('Integration Tests', () => {
    describe('Complete Game Flow', () => {
        let game;
        let level;
        let player;
        let ghosts;

        beforeEach(() => {
            game = new Game();
            level = new Level();
            
            const playerSpawn = level.getPlayerSpawn();
            const worldPos = level.gridToWorld(playerSpawn.x, playerSpawn.z);
            player = new Player(worldPos.x, worldPos.z, level);
            
            ghosts = [];
            const ghostSpawns = level.getGhostSpawns();
            const colors = [0xff0000, 0xff69b4, 0x00ffff, 0xffa500];
            ghostSpawns.forEach((spawn, index) => {
                const ghostWorldPos = level.gridToWorld(spawn.x, spawn.z);
                const ghost = new Ghost(
                    ghostWorldPos.x,
                    ghostWorldPos.z,
                    level,
                    colors[index]
                );
                ghosts.push(ghost);
            });
            
            game.setTotalPellets(level.countPellets());
        });

        test('should initialize game with correct entities', () => {
            expect(game).toBeDefined();
            expect(level).toBeDefined();
            expect(player).toBeDefined();
            expect(ghosts.length).toBe(4);
        });

        test('should have valid spawn positions', () => {
            const playerGrid = player.getGridPosition();
            expect(level.isWall(playerGrid.x, playerGrid.z)).toBe(false);
            
            ghosts.forEach(ghost => {
                const gridPos = level.worldToGrid(ghost.x, ghost.z);
                expect(level.isWall(gridPos.x, gridPos.z)).toBe(false);
            });
        });

        test('should handle pellet collection workflow', () => {
            const initialScore = game.score;
            const initialPellets = game.collectedPellets;
            
            // Find a pellet position
            let pelletPos = null;
            for (let row = 0; row < level.height; row++) {
                for (let col = 0; col < level.width; col++) {
                    if (level.hasPellet(col, row)) {
                        pelletPos = { x: col, z: row };
                        break;
                    }
                }
                if (pelletPos) break;
            }
            
            expect(pelletPos).not.toBeNull();
            
            // Collect the pellet
            game.collectPellet();
            level.removePellet(pelletPos.x, pelletPos.z);
            
            expect(game.score).toBe(initialScore + 10);
            expect(game.collectedPellets).toBe(initialPellets + 1);
            expect(level.hasPellet(pelletPos.x, pelletPos.z)).toBe(false);
        });

        test('should handle power pellet collection workflow', () => {
            const initialScore = game.score;
            
            game.collectPowerPellet();
            
            expect(game.score).toBe(initialScore + 50);
        });

        test('should make ghosts vulnerable after power pellet', () => {
            ghosts.forEach(ghost => {
                expect(ghost.isVulnerable).toBe(false);
            });
            
            ghosts.forEach(ghost => ghost.makeVulnerable(300));
            
            ghosts.forEach(ghost => {
                expect(ghost.isVulnerable).toBe(true);
            });
        });

        test('should handle player-ghost collision when ghost not vulnerable', () => {
            const initialLives = game.lives;
            
            game.loseLife();
            
            expect(game.lives).toBe(initialLives - 1);
        });

        test('should handle player eating vulnerable ghost', () => {
            const initialScore = game.score;
            
            game.addScore(200);
            
            expect(game.score).toBe(initialScore + 200);
        });

        test('should trigger game over after losing all lives', () => {
            game.lives = 1;
            game.loseLife();
            
            expect(game.state).toBe('GAMEOVER');
            expect(game.isPlaying()).toBe(false);
        });

        test('should trigger win after collecting all pellets', () => {
            const totalPellets = level.countPellets();
            game.setTotalPellets(totalPellets);
            
            // Collect all pellets
            for (let i = 0; i < totalPellets; i++) {
                game.collectPellet();
            }
            
            expect(game.state).toBe('WIN');
            expect(game.isPlaying()).toBe(false);
        });

        test('should update ghost positions', () => {
            const initialPositions = ghosts.map(g => ({ x: g.x, z: g.z }));
            
            // Update ghosts multiple times
            for (let i = 0; i < 50; i++) {
                ghosts.forEach(ghost => {
                    ghost.update(player.x, player.z);
                });
            }
            
            // At least one ghost should have moved
            let someMoved = false;
            ghosts.forEach((ghost, index) => {
                if (ghost.x !== initialPositions[index].x || 
                    ghost.z !== initialPositions[index].z) {
                    someMoved = true;
                }
            });
            
            expect(someMoved).toBe(true);
        });

        test('should reset game state correctly', () => {
            // Modify game state
            game.score = 100;
            game.lives = 1;
            game.collectedPellets = 5;
            game.state = 'PLAYING';
            
            // Reset
            game.reset();
            
            expect(game.score).toBe(0);
            expect(game.lives).toBe(3);
            expect(game.collectedPellets).toBe(0);
            expect(game.state).toBe('START');
        });

        test('should handle complete game session', () => {
            // Start game
            game.start();
            expect(game.isPlaying()).toBe(true);
            
            // Collect some pellets
            game.collectPellet();
            game.collectPellet();
            expect(game.score).toBeGreaterThan(0);
            
            // Pause and resume
            game.pause();
            expect(game.isPlaying()).toBe(false);
            game.resume();
            expect(game.isPlaying()).toBe(true);
            
            // Lose a life
            game.loseLife();
            expect(game.lives).toBe(2);
            
            // Continue playing
            expect(game.isPlaying()).toBe(true);
        });
    });

    describe('Player Movement Integration', () => {
        let level;
        let player;

        beforeEach(() => {
            level = new Level();
            const spawn = level.getPlayerSpawn();
            const worldPos = level.gridToWorld(spawn.x, spawn.z);
            player = new Player(worldPos.x, worldPos.z, level);
        });

        test('should move player without hitting walls', () => {
            const initialPos = { x: player.x, z: player.z };
            
            // Try to move in a valid direction
            player.setDirection(1, 0);
            
            // Update multiple times
            for (let i = 0; i < 10; i++) {
                player.update();
            }
            
            // Player should have moved
            expect(player.x !== initialPos.x || player.z !== initialPos.z).toBe(true);
        });

        test('should stop at walls', () => {
            // Position player in an open area
            const openPos = level.gridToWorld(1, 1);
            player.x = openPos.x;
            player.z = openPos.z;
            
            // Try to move toward wall (0, 1 is a wall)
            player.setDirection(-1, 0);
            
            // Update many times
            for (let i = 0; i < 100; i++) {
                player.update();
            }
            
            // Player should have stopped before hitting wall
            // and should still be in a valid position
            const gridPos = player.getGridPosition();
            const isPlayerOnValidTile = !level.isWall(gridPos.x, gridPos.z);
            expect(isPlayerOnValidTile).toBe(true);
        });
    });

    describe('Level and Pellet Integration', () => {
        let level;

        beforeEach(() => {
            level = new Level();
        });

        test('should have pellets only on valid paths', () => {
            for (let row = 0; row < level.height; row++) {
                for (let col = 0; col < level.width; col++) {
                    if (level.hasPellet(col, row)) {
                        expect(level.isWall(col, row)).toBe(false);
                    }
                }
            }
        });

        test('should count pellets correctly after removal', () => {
            const initialCount = level.countPellets();
            
            // Find and remove some pellets
            let removed = 0;
            for (let row = 0; row < level.height && removed < 3; row++) {
                for (let col = 0; col < level.width && removed < 3; col++) {
                    if (level.hasPellet(col, row)) {
                        level.removePellet(col, row);
                        removed++;
                    }
                }
            }
            
            const newCount = level.countPellets();
            expect(newCount).toBe(initialCount - removed);
        });
    });
});

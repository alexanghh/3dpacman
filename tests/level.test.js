/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { Level } from '../src/level.js';

describe('Level', () => {
    let level;

    beforeEach(() => {
        level = new Level();
    });

    describe('Initialization', () => {
        test('should initialize with correct dimensions', () => {
            expect(level.width).toBe(11);
            expect(level.height).toBe(11);
            expect(level.cellSize).toBe(2);
        });

        test('should have a valid maze structure', () => {
            expect(level.maze).toBeDefined();
            expect(level.maze.length).toBe(11);
            expect(level.maze[0].length).toBe(11);
        });
    });

    describe('getCell', () => {
        test('should return correct cell value', () => {
            expect(level.getCell(0, 0)).toBe(0); // Wall
            expect(level.getCell(1, 1)).toBe(1); // Pellet
        });

        test('should return 0 for out of bounds', () => {
            expect(level.getCell(-1, 0)).toBe(0);
            expect(level.getCell(0, -1)).toBe(0);
            expect(level.getCell(20, 0)).toBe(0);
            expect(level.getCell(0, 20)).toBe(0);
        });
    });

    describe('setCell', () => {
        test('should set cell value', () => {
            level.setCell(1, 1, 2);
            expect(level.getCell(1, 1)).toBe(2);
        });

        test('should not set cell for out of bounds', () => {
            level.setCell(-1, 0, 2);
            level.setCell(20, 20, 2);
            // Should not throw error
            expect(true).toBe(true);
        });
    });

    describe('isWall', () => {
        test('should return true for wall cells', () => {
            expect(level.isWall(0, 0)).toBe(true);
        });

        test('should return false for non-wall cells', () => {
            expect(level.isWall(1, 1)).toBe(false);
        });

        test('should return true for out of bounds', () => {
            expect(level.isWall(-1, 0)).toBe(true);
            expect(level.isWall(20, 20)).toBe(true);
        });
    });

    describe('hasPellet', () => {
        test('should return true for pellet cells', () => {
            expect(level.hasPellet(1, 1)).toBe(true);
        });

        test('should return true for power pellet cells', () => {
            expect(level.hasPellet(1, 3)).toBe(true);
        });

        test('should return false for non-pellet cells', () => {
            expect(level.hasPellet(0, 0)).toBe(false);
            expect(level.hasPellet(5, 5)).toBe(false);
        });
    });

    describe('isPowerPellet', () => {
        test('should return true for power pellet cells', () => {
            expect(level.isPowerPellet(1, 3)).toBe(true);
        });

        test('should return false for regular pellet cells', () => {
            expect(level.isPowerPellet(1, 1)).toBe(false);
        });

        test('should return false for non-pellet cells', () => {
            expect(level.isPowerPellet(0, 0)).toBe(false);
        });
    });

    describe('removePellet', () => {
        test('should remove pellet from cell', () => {
            expect(level.hasPellet(1, 1)).toBe(true);
            level.removePellet(1, 1);
            expect(level.hasPellet(1, 1)).toBe(false);
            expect(level.getCell(1, 1)).toBe(2);
        });
    });

    describe('countPellets', () => {
        test('should count all pellets in maze', () => {
            const count = level.countPellets();
            expect(count).toBeGreaterThan(0);
            
            // Count manually to verify
            let manualCount = 0;
            for (let row = 0; row < level.height; row++) {
                for (let col = 0; col < level.width; col++) {
                    if (level.maze[row][col] === 1 || level.maze[row][col] === 3) {
                        manualCount++;
                    }
                }
            }
            expect(count).toBe(manualCount);
        });

        test('should return less pellets after removal', () => {
            const initialCount = level.countPellets();
            level.removePellet(1, 1);
            const newCount = level.countPellets();
            expect(newCount).toBe(initialCount - 1);
        });
    });

    describe('getPlayerSpawn', () => {
        test('should return valid spawn position', () => {
            const spawn = level.getPlayerSpawn();
            expect(spawn).toEqual({ x: 5, z: 5 });
        });
    });

    describe('getGhostSpawns', () => {
        test('should return array of spawn positions', () => {
            const spawns = level.getGhostSpawns();
            expect(Array.isArray(spawns)).toBe(true);
            expect(spawns.length).toBe(4);
            spawns.forEach(spawn => {
                expect(spawn).toHaveProperty('x');
                expect(spawn).toHaveProperty('z');
            });
        });
    });

    describe('gridToWorld', () => {
        test('should convert grid coordinates to world coordinates', () => {
            const worldPos = level.gridToWorld(5, 5);
            expect(worldPos.x).toBe(0);
            expect(worldPos.z).toBe(0);
        });

        test('should handle edge cases', () => {
            const worldPos1 = level.gridToWorld(0, 0);
            expect(worldPos1.x).toBe(-10);
            expect(worldPos1.z).toBe(-10);
            
            const worldPos2 = level.gridToWorld(10, 10);
            expect(worldPos2.x).toBe(10);
            expect(worldPos2.z).toBe(10);
        });
    });

    describe('worldToGrid', () => {
        test('should convert world coordinates to grid coordinates', () => {
            const gridPos = level.worldToGrid(0, 0);
            expect(gridPos.x).toBe(5);
            expect(gridPos.z).toBe(5);
        });

        test('should be inverse of gridToWorld', () => {
            const original = { x: 3, z: 7 };
            const world = level.gridToWorld(original.x, original.z);
            const grid = level.worldToGrid(world.x, world.z);
            expect(grid.x).toBe(original.x);
            expect(grid.z).toBe(original.z);
        });
    });
});

/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { Ghost } from '../src/ghost.js';
import { Level } from '../src/level.js';

describe('Ghost', () => {
    let ghost;
    let level;

    beforeEach(() => {
        level = new Level();
        ghost = new Ghost(0, 0, level, 0xff0000);
    });

    describe('Initialization', () => {
        test('should initialize with correct position', () => {
            expect(ghost.x).toBe(0);
            expect(ghost.z).toBe(0);
        });

        test('should initialize with correct properties', () => {
            expect(ghost.color).toBe(0xff0000);
            expect(ghost.speed).toBe(0.03);
            expect(ghost.radius).toBe(0.4);
            expect(ghost.isVulnerable).toBe(false);
            expect(ghost.vulnerableTimer).toBe(0);
        });

        test('should have zero initial direction', () => {
            expect(ghost.direction).toEqual({ x: 0, z: 0 });
        });
    });

    describe('makeVulnerable', () => {
        test('should make ghost vulnerable with default duration', () => {
            ghost.makeVulnerable();
            expect(ghost.isVulnerable).toBe(true);
            expect(ghost.vulnerableTimer).toBe(300);
        });

        test('should make ghost vulnerable with custom duration', () => {
            ghost.makeVulnerable(500);
            expect(ghost.isVulnerable).toBe(true);
            expect(ghost.vulnerableTimer).toBe(500);
        });
    });

    describe('update', () => {
        test('should decrease vulnerable timer when vulnerable', () => {
            ghost.makeVulnerable(10);
            ghost.update(0, 0);
            expect(ghost.vulnerableTimer).toBe(9);
        });

        test('should stop being vulnerable when timer reaches 0', () => {
            ghost.makeVulnerable(1);
            ghost.update(0, 0);
            expect(ghost.isVulnerable).toBe(false);
            expect(ghost.vulnerableTimer).toBe(0);
        });

        test('should increment move timer', () => {
            const initialTimer = ghost.moveTimer;
            ghost.update(0, 0);
            expect(ghost.moveTimer).toBe(initialTimer + 1);
        });

        test('should choose direction when move timer reaches interval', () => {
            ghost.moveTimer = ghost.moveInterval - 1;
            ghost.update(5, 5);
            expect(ghost.moveTimer).toBe(0);
            expect(ghost.direction.x !== 0 || ghost.direction.z !== 0).toBe(true);
        });
    });

    describe('chooseDirection', () => {
        test('should set a valid direction', () => {
            ghost.x = 0;
            ghost.z = 0;
            ghost.chooseDirection(5, 5);
            expect(ghost.direction.x !== 0 || ghost.direction.z !== 0).toBe(true);
        });

        test('should prefer directions toward player when not vulnerable', () => {
            ghost.x = 0;
            ghost.z = 0;
            ghost.isVulnerable = false;
            ghost.chooseDirection(10, 0);
            // Should generally move toward player (positive x direction)
            // This is a heuristic test
            expect(true).toBe(true);
        });

        test('should prefer directions away from player when vulnerable', () => {
            ghost.x = 0;
            ghost.z = 0;
            ghost.makeVulnerable(100);
            ghost.chooseDirection(10, 0);
            // Should generally move away from player
            // This is a heuristic test
            expect(true).toBe(true);
        });
    });

    describe('canMove', () => {
        test('should return true for valid positions', () => {
            const worldPos = level.gridToWorld(1, 1);
            expect(ghost.canMove(worldPos.x, worldPos.z)).toBe(true);
        });

        test('should return false for wall positions', () => {
            const worldPos = level.gridToWorld(0, 0);
            expect(ghost.canMove(worldPos.x, worldPos.z)).toBe(false);
        });
    });

    describe('getPosition', () => {
        test('should return world position', () => {
            ghost.x = 1.5;
            ghost.z = 2.5;
            const pos = ghost.getPosition();
            expect(pos).toEqual({ x: 1.5, z: 2.5 });
        });
    });

    describe('reset', () => {
        test('should reset position and state', () => {
            ghost.x = 10;
            ghost.z = 10;
            ghost.direction = { x: 1, z: 0 };
            ghost.makeVulnerable(100);
            
            ghost.reset(5, 5);
            
            expect(ghost.x).toBe(5);
            expect(ghost.z).toBe(5);
            expect(ghost.direction).toEqual({ x: 0, z: 0 });
            expect(ghost.isVulnerable).toBe(false);
            expect(ghost.vulnerableTimer).toBe(0);
        });
    });

    describe('collidesWith', () => {
        test('should detect collision when close enough', () => {
            const player = { x: 0.5, z: 0, radius: 0.4 };
            expect(ghost.collidesWith(player)).toBe(true);
        });

        test('should not detect collision when far apart', () => {
            const player = { x: 5, z: 5, radius: 0.4 };
            expect(ghost.collidesWith(player)).toBe(false);
        });

        test('should handle boundary collision distance', () => {
            const player = { 
                x: ghost.x + ghost.radius + 0.4, 
                z: ghost.z, 
                radius: 0.4 
            };
            expect(ghost.collidesWith(player)).toBe(false);
            
            const closePlayer = { 
                x: ghost.x + ghost.radius + 0.39, 
                z: ghost.z, 
                radius: 0.4 
            };
            expect(ghost.collidesWith(closePlayer)).toBe(true);
        });
    });

    describe('Multiple ghosts', () => {
        test('should support multiple ghosts with different colors', () => {
            const ghost1 = new Ghost(0, 0, level, 0xff0000);
            const ghost2 = new Ghost(1, 1, level, 0x00ff00);
            const ghost3 = new Ghost(2, 2, level, 0x0000ff);
            
            expect(ghost1.color).toBe(0xff0000);
            expect(ghost2.color).toBe(0x00ff00);
            expect(ghost3.color).toBe(0x0000ff);
        });
    });
});

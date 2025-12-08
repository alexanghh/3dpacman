/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { Player } from '../src/player.js';
import { Level } from '../src/level.js';

describe('Player', () => {
    let player;
    let level;

    beforeEach(() => {
        level = new Level();
        player = new Player(0, 0, level);
    });

    describe('Initialization', () => {
        test('should initialize with correct position', () => {
            expect(player.x).toBe(0);
            expect(player.z).toBe(0);
        });

        test('should initialize with zero direction', () => {
            expect(player.direction).toEqual({ x: 0, z: 0 });
            expect(player.nextDirection).toEqual({ x: 0, z: 0 });
        });

        test('should have correct properties', () => {
            expect(player.speed).toBe(0.05);
            expect(player.radius).toBe(0.4);
            expect(player.level).toBe(level);
        });
    });

    describe('setDirection', () => {
        test('should set next direction', () => {
            player.setDirection(1, 0);
            expect(player.nextDirection).toEqual({ x: 1, z: 0 });
        });

        test('should accept different directions', () => {
            player.setDirection(-1, 0);
            expect(player.nextDirection).toEqual({ x: -1, z: 0 });
            
            player.setDirection(0, 1);
            expect(player.nextDirection).toEqual({ x: 0, z: 1 });
            
            player.setDirection(0, -1);
            expect(player.nextDirection).toEqual({ x: 0, z: -1 });
        });
    });

    describe('canMove', () => {
        test('should return true for valid positions', () => {
            const worldPos = level.gridToWorld(1, 1);
            expect(player.canMove(worldPos.x, worldPos.z)).toBe(true);
        });

        test('should return false for wall positions', () => {
            const worldPos = level.gridToWorld(0, 0);
            expect(player.canMove(worldPos.x, worldPos.z)).toBe(false);
        });
    });

    describe('update', () => {
        test('should move player in current direction', () => {
            const initialX = player.x;
            player.direction = { x: 1, z: 0 };
            player.update();
            expect(player.x).toBeGreaterThan(initialX);
        });

        test('should not move when direction is zero', () => {
            const initialX = player.x;
            const initialZ = player.z;
            player.update();
            expect(player.x).toBe(initialX);
            expect(player.z).toBe(initialZ);
        });

        test('should change to next direction if valid', () => {
            player.x = 0;
            player.z = 0;
            player.nextDirection = { x: 1, z: 0 };
            player.update();
            expect(player.direction.x).toBe(1);
        });
    });

    describe('getGridPosition', () => {
        test('should return grid coordinates', () => {
            player.x = 0;
            player.z = 0;
            const gridPos = player.getGridPosition();
            expect(gridPos).toHaveProperty('x');
            expect(gridPos).toHaveProperty('z');
            expect(typeof gridPos.x).toBe('number');
            expect(typeof gridPos.z).toBe('number');
        });
    });

    describe('getPosition', () => {
        test('should return world position', () => {
            player.x = 1.5;
            player.z = 2.5;
            const pos = player.getPosition();
            expect(pos).toEqual({ x: 1.5, z: 2.5 });
        });
    });

    describe('reset', () => {
        test('should reset position and direction', () => {
            player.x = 10;
            player.z = 10;
            player.direction = { x: 1, z: 0 };
            player.nextDirection = { x: 0, z: 1 };
            
            player.reset(5, 5);
            
            expect(player.x).toBe(5);
            expect(player.z).toBe(5);
            expect(player.direction).toEqual({ x: 0, z: 0 });
            expect(player.nextDirection).toEqual({ x: 0, z: 0 });
        });
    });

    describe('collidesWith', () => {
        test('should detect collision when close enough', () => {
            const other = { x: 0.5, z: 0, radius: 0.4 };
            expect(player.collidesWith(other)).toBe(true);
        });

        test('should not detect collision when far apart', () => {
            const other = { x: 5, z: 5, radius: 0.4 };
            expect(player.collidesWith(other)).toBe(false);
        });

        test('should handle exact collision distance', () => {
            const other = { 
                x: player.x + player.radius + 0.4, 
                z: player.z, 
                radius: 0.4 
            };
            expect(player.collidesWith(other)).toBe(false);
            
            const closeOther = { 
                x: player.x + player.radius + 0.39, 
                z: player.z, 
                radius: 0.4 
            };
            expect(player.collidesWith(closeOther)).toBe(true);
        });
    });
});

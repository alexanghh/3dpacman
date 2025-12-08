/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { Game } from '../src/game.js';

describe('Game', () => {
    let game;

    beforeEach(() => {
        game = new Game();
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(game.score).toBe(0);
            expect(game.lives).toBe(3);
            expect(game.level).toBe(1);
            expect(game.state).toBe('START');
            expect(game.totalPellets).toBe(0);
            expect(game.collectedPellets).toBe(0);
        });
    });

    describe('reset', () => {
        test('should reset game to initial state', () => {
            game.score = 100;
            game.lives = 1;
            game.level = 2;
            game.state = 'PLAYING';
            game.collectedPellets = 5;

            game.reset();

            expect(game.score).toBe(0);
            expect(game.lives).toBe(3);
            expect(game.level).toBe(1);
            expect(game.state).toBe('START');
            expect(game.collectedPellets).toBe(0);
        });
    });

    describe('start', () => {
        test('should change state to PLAYING', () => {
            game.start();
            expect(game.state).toBe('PLAYING');
        });
    });

    describe('pause and resume', () => {
        test('should pause when playing', () => {
            game.start();
            game.pause();
            expect(game.state).toBe('PAUSED');
        });

        test('should not pause when not playing', () => {
            game.pause();
            expect(game.state).toBe('START');
        });

        test('should resume when paused', () => {
            game.start();
            game.pause();
            game.resume();
            expect(game.state).toBe('PLAYING');
        });

        test('should not resume when not paused', () => {
            game.resume();
            expect(game.state).toBe('START');
        });
    });

    describe('addScore', () => {
        test('should add points to score', () => {
            game.addScore(10);
            expect(game.score).toBe(10);
            game.addScore(20);
            expect(game.score).toBe(30);
        });
    });

    describe('loseLife', () => {
        test('should decrease lives', () => {
            game.loseLife();
            expect(game.lives).toBe(2);
        });

        test('should trigger game over when lives reach 0', () => {
            game.lives = 1;
            game.loseLife();
            expect(game.lives).toBe(0);
            expect(game.state).toBe('GAMEOVER');
        });
    });

    describe('collectPellet', () => {
        test('should increase collected pellets and score', () => {
            game.collectPellet();
            expect(game.collectedPellets).toBe(1);
            expect(game.score).toBe(10);
        });

        test('should trigger win when all pellets collected', () => {
            game.setTotalPellets(2);
            game.collectPellet();
            expect(game.state).toBe('START');
            game.collectPellet();
            expect(game.state).toBe('WIN');
        });
    });

    describe('collectPowerPellet', () => {
        test('should increase collected pellets and score by 50', () => {
            game.collectPowerPellet();
            expect(game.collectedPellets).toBe(1);
            expect(game.score).toBe(50);
        });

        test('should trigger win when all pellets collected', () => {
            game.setTotalPellets(1);
            game.collectPowerPellet();
            expect(game.state).toBe('WIN');
        });
    });

    describe('isPlaying', () => {
        test('should return true when playing', () => {
            game.start();
            expect(game.isPlaying()).toBe(true);
        });

        test('should return false when not playing', () => {
            expect(game.isPlaying()).toBe(false);
            game.gameOver();
            expect(game.isPlaying()).toBe(false);
        });
    });

    describe('getState', () => {
        test('should return complete game state', () => {
            game.score = 100;
            game.lives = 2;
            game.level = 1;
            game.collectedPellets = 5;
            game.totalPellets = 10;
            
            const state = game.getState();
            
            expect(state).toEqual({
                score: 100,
                lives: 2,
                level: 1,
                state: 'START',
                collectedPellets: 5,
                totalPellets: 10
            });
        });
    });
});

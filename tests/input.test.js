/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { InputHandler } from '../src/input.js';

describe('InputHandler', () => {
    let inputHandler;

    beforeEach(() => {
        inputHandler = new InputHandler();
    });

    describe('Initialization', () => {
        test('should initialize with empty keys set', () => {
            expect(inputHandler.keys.size).toBe(0);
        });
    });

    describe('Key press simulation', () => {
        test('should detect key press', () => {
            const event = new KeyboardEvent('keydown', { key: 'w' });
            window.dispatchEvent(event);
            expect(inputHandler.isKeyPressed('w')).toBe(true);
        });

        test('should detect key release', () => {
            const downEvent = new KeyboardEvent('keydown', { key: 'w' });
            const upEvent = new KeyboardEvent('keyup', { key: 'w' });
            window.dispatchEvent(downEvent);
            expect(inputHandler.isKeyPressed('w')).toBe(true);
            window.dispatchEvent(upEvent);
            expect(inputHandler.isKeyPressed('w')).toBe(false);
        });

        test('should be case insensitive', () => {
            const event = new KeyboardEvent('keydown', { key: 'W' });
            window.dispatchEvent(event);
            expect(inputHandler.isKeyPressed('w')).toBe(true);
            expect(inputHandler.isKeyPressed('W')).toBe(true);
        });
    });

    describe('getDirection', () => {
        test('should return up direction for W key', () => {
            const event = new KeyboardEvent('keydown', { key: 'w' });
            window.dispatchEvent(event);
            const dir = inputHandler.getDirection();
            expect(dir.z).toBe(-1);
            expect(dir.x).toBe(0);
        });

        test('should return down direction for S key', () => {
            const event = new KeyboardEvent('keydown', { key: 's' });
            window.dispatchEvent(event);
            const dir = inputHandler.getDirection();
            expect(dir.z).toBe(1);
            expect(dir.x).toBe(0);
        });

        test('should return left direction for A key', () => {
            const event = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event);
            const dir = inputHandler.getDirection();
            expect(dir.x).toBe(-1);
            expect(dir.z).toBe(0);
        });

        test('should return right direction for D key', () => {
            const event = new KeyboardEvent('keydown', { key: 'd' });
            window.dispatchEvent(event);
            const dir = inputHandler.getDirection();
            expect(dir.x).toBe(1);
            expect(dir.z).toBe(0);
        });

        test('should support arrow keys', () => {
            const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            window.dispatchEvent(upEvent);
            let dir = inputHandler.getDirection();
            expect(dir.z).toBe(-1);
            
            inputHandler.clear();
            
            const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            window.dispatchEvent(downEvent);
            dir = inputHandler.getDirection();
            expect(dir.z).toBe(1);
            
            inputHandler.clear();
            
            const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            window.dispatchEvent(leftEvent);
            dir = inputHandler.getDirection();
            expect(dir.x).toBe(-1);
            
            inputHandler.clear();
            
            const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            window.dispatchEvent(rightEvent);
            dir = inputHandler.getDirection();
            expect(dir.x).toBe(1);
        });

        test('should return zero direction when no keys pressed', () => {
            const dir = inputHandler.getDirection();
            expect(dir.x).toBe(0);
            expect(dir.z).toBe(0);
        });

        test('should prioritize vertical over horizontal when both pressed', () => {
            const wEvent = new KeyboardEvent('keydown', { key: 'w' });
            const dEvent = new KeyboardEvent('keydown', { key: 'd' });
            window.dispatchEvent(wEvent);
            window.dispatchEvent(dEvent);
            const dir = inputHandler.getDirection();
            expect(dir.z).toBe(-1);
            expect(dir.x).toBe(0);
        });
    });

    describe('clear', () => {
        test('should clear all pressed keys', () => {
            const event1 = new KeyboardEvent('keydown', { key: 'w' });
            const event2 = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event1);
            window.dispatchEvent(event2);
            
            expect(inputHandler.keys.size).toBeGreaterThan(0);
            
            inputHandler.clear();
            
            expect(inputHandler.keys.size).toBe(0);
            expect(inputHandler.isKeyPressed('w')).toBe(false);
            expect(inputHandler.isKeyPressed('a')).toBe(false);
        });
    });
});

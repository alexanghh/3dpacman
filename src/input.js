/**
 * InputHandler class manages keyboard input
 */
export class InputHandler {
    constructor() {
        this.keys = new Set();
        this.setupListeners();
    }

    /**
     * Setup keyboard event listeners
     */
    setupListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.key.toLowerCase());
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
        });
    }

    /**
     * Check if key is pressed
     */
    isKeyPressed(key) {
        return this.keys.has(key.toLowerCase());
    }

    /**
     * Get movement direction from input
     */
    getDirection() {
        let x = 0;
        let z = 0;

        if (this.isKeyPressed('arrowup') || this.isKeyPressed('w')) {
            z = -1;
        } else if (this.isKeyPressed('arrowdown') || this.isKeyPressed('s')) {
            z = 1;
        } else if (this.isKeyPressed('arrowleft') || this.isKeyPressed('a')) {
            x = -1;
        } else if (this.isKeyPressed('arrowright') || this.isKeyPressed('d')) {
            x = 1;
        }

        return { x, z };
    }

    /**
     * Clear all keys
     */
    clear() {
        this.keys.clear();
    }
}

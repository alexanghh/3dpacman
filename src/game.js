/**
 * Game class manages the overall game state and flow
 */
export class Game {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.state = 'START'; // START, PLAYING, PAUSED, GAMEOVER, WIN
        this.totalPellets = 0;
        this.collectedPellets = 0;
    }

    /**
     * Initialize or reset the game state
     */
    reset() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.state = 'START';
        this.collectedPellets = 0;
    }

    /**
     * Start the game
     */
    start() {
        this.state = 'PLAYING';
    }

    /**
     * Pause the game
     */
    pause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
        }
    }

    /**
     * Resume the game
     */
    resume() {
        if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
        }
    }

    /**
     * Add score points
     */
    addScore(points) {
        this.score += points;
    }

    /**
     * Lose a life
     */
    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    /**
     * Collect a pellet
     */
    collectPellet() {
        this.collectedPellets++;
        this.addScore(10);
        
        if (this.collectedPellets >= this.totalPellets) {
            this.win();
        }
    }

    /**
     * Collect a power pellet
     */
    collectPowerPellet() {
        this.collectedPellets++;
        this.addScore(50);
        
        if (this.collectedPellets >= this.totalPellets) {
            this.win();
        }
    }

    /**
     * Set total pellets in level
     */
    setTotalPellets(count) {
        this.totalPellets = count;
    }

    /**
     * Game over
     */
    gameOver() {
        this.state = 'GAMEOVER';
    }

    /**
     * Win the game
     */
    win() {
        this.state = 'WIN';
    }

    /**
     * Check if game is playing
     */
    isPlaying() {
        return this.state === 'PLAYING';
    }

    /**
     * Get current game state
     */
    getState() {
        return {
            score: this.score,
            lives: this.lives,
            level: this.level,
            state: this.state,
            collectedPellets: this.collectedPellets,
            totalPellets: this.totalPellets
        };
    }
}

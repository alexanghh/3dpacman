/**
 * Level class represents the 3D maze structure
 */
export class Level {
    constructor() {
        // 0 = wall, 1 = path with pellet, 2 = path without pellet, 3 = power pellet
        this.maze = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
            [0, 3, 1, 1, 1, 1, 1, 1, 1, 3, 0],
            [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
            [0, 3, 1, 1, 1, 1, 1, 1, 1, 3, 0],
            [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        
        this.width = this.maze[0].length;
        this.height = this.maze.length;
        this.cellSize = 2;
    }

    /**
     * Get cell value at position
     */
    getCell(x, z) {
        const row = Math.floor(z);
        const col = Math.floor(x);
        
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
            return 0; // Wall if out of bounds
        }
        
        return this.maze[row][col];
    }

    /**
     * Set cell value at position
     */
    setCell(x, z, value) {
        const row = Math.floor(z);
        const col = Math.floor(x);
        
        if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
            this.maze[row][col] = value;
        }
    }

    /**
     * Check if position is a wall
     */
    isWall(x, z) {
        return this.getCell(x, z) === 0;
    }

    /**
     * Check if position has a pellet
     */
    hasPellet(x, z) {
        const cell = this.getCell(x, z);
        return cell === 1 || cell === 3;
    }

    /**
     * Check if position has a power pellet
     */
    isPowerPellet(x, z) {
        return this.getCell(x, z) === 3;
    }

    /**
     * Remove pellet at position
     */
    removePellet(x, z) {
        this.setCell(x, z, 2);
    }

    /**
     * Count total pellets in maze
     */
    countPellets() {
        let count = 0;
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (this.maze[row][col] === 1 || this.maze[row][col] === 3) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Get spawn position for player
     */
    getPlayerSpawn() {
        return { x: 5, z: 5 };
    }

    /**
     * Get spawn positions for ghosts
     */
    getGhostSpawns() {
        return [
            { x: 4, z: 5 },
            { x: 6, z: 5 },
            { x: 5, z: 3 },
            { x: 5, z: 7 }
        ];
    }

    /**
     * Convert grid position to world position
     */
    gridToWorld(x, z) {
        return {
            x: (x - Math.floor(this.width / 2)) * this.cellSize,
            z: (z - Math.floor(this.height / 2)) * this.cellSize
        };
    }

    /**
     * Convert world position to grid position
     */
    worldToGrid(x, z) {
        return {
            x: Math.floor(x / this.cellSize + Math.floor(this.width / 2)),
            z: Math.floor(z / this.cellSize + Math.floor(this.height / 2))
        };
    }
}

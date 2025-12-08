/**
 * Player class represents Pac-Man character
 */
export class Player {
    constructor(x, z, level) {
        this.x = x;
        this.z = z;
        this.level = level;
        this.speed = 0.05;
        this.direction = { x: 0, z: 0 };
        this.nextDirection = { x: 0, z: 0 };
        this.radius = 0.4;
    }

    /**
     * Set movement direction
     */
    setDirection(x, z) {
        this.nextDirection = { x, z };
    }

    /**
     * Update player position
     */
    update() {
        // Try to change direction if requested
        if (this.nextDirection.x !== 0 || this.nextDirection.z !== 0) {
            const nextX = this.x + this.nextDirection.x * this.speed;
            const nextZ = this.z + this.nextDirection.z * this.speed;
            
            if (this.canMove(nextX, nextZ)) {
                this.direction = { ...this.nextDirection };
            }
        }

        // Move in current direction
        if (this.direction.x !== 0 || this.direction.z !== 0) {
            const newX = this.x + this.direction.x * this.speed;
            const newZ = this.z + this.direction.z * this.speed;
            
            if (this.canMove(newX, newZ)) {
                this.x = newX;
                this.z = newZ;
            } else {
                // Stop if hit wall
                this.direction = { x: 0, z: 0 };
            }
        }
    }

    /**
     * Check if player can move to position
     */
    canMove(x, z) {
        const gridPos = this.level.worldToGrid(x, z);
        return !this.level.isWall(gridPos.x, gridPos.z);
    }

    /**
     * Get current grid position
     */
    getGridPosition() {
        return this.level.worldToGrid(this.x, this.z);
    }

    /**
     * Get world position
     */
    getPosition() {
        return { x: this.x, z: this.z };
    }

    /**
     * Reset to spawn position
     */
    reset(x, z) {
        this.x = x;
        this.z = z;
        this.direction = { x: 0, z: 0 };
        this.nextDirection = { x: 0, z: 0 };
    }

    /**
     * Check collision with another entity
     */
    collidesWith(other) {
        const dx = this.x - other.x;
        const dz = this.z - other.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        return distance < (this.radius + other.radius);
    }
}

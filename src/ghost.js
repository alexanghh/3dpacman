/**
 * Ghost class represents enemy characters
 */
export class Ghost {
    constructor(x, z, level, color) {
        this.x = x;
        this.z = z;
        this.level = level;
        this.color = color;
        this.speed = 0.03;
        this.direction = { x: 0, z: 0 };
        this.radius = 0.4;
        this.isVulnerable = false;
        this.vulnerableTimer = 0;
        this.moveTimer = 0;
        this.moveInterval = 20; // Change direction every N frames
    }

    /**
     * Update ghost position and AI
     */
    update(playerX, playerZ) {
        this.moveTimer++;
        
        if (this.isVulnerable) {
            this.vulnerableTimer--;
            if (this.vulnerableTimer <= 0) {
                this.isVulnerable = false;
            }
        }

        // Simple AI: change direction periodically
        if (this.moveTimer >= this.moveInterval) {
            this.moveTimer = 0;
            this.chooseDirection(playerX, playerZ);
        }

        // Move in current direction
        if (this.direction.x !== 0 || this.direction.z !== 0) {
            const newX = this.x + this.direction.x * this.speed;
            const newZ = this.z + this.direction.z * this.speed;
            
            if (this.canMove(newX, newZ)) {
                this.x = newX;
                this.z = newZ;
            } else {
                // If hit wall, choose new direction immediately
                this.chooseDirection(playerX, playerZ);
            }
        }
    }

    /**
     * Choose a new direction based on simple AI
     */
    chooseDirection(playerX, playerZ) {
        const directions = [
            { x: 1, z: 0 },
            { x: -1, z: 0 },
            { x: 0, z: 1 },
            { x: 0, z: -1 }
        ];

        // If vulnerable, move away from player
        if (this.isVulnerable) {
            const dx = this.x - playerX;
            const dz = this.z - playerZ;
            
            // Prefer directions away from player
            directions.sort((a, b) => {
                const aDist = (dx + a.x) * (dx + a.x) + (dz + a.z) * (dz + a.z);
                const bDist = (dx + b.x) * (dx + b.x) + (dz + b.z) * (dz + b.z);
                return bDist - aDist;
            });
        } else {
            // Move toward player
            const dx = playerX - this.x;
            const dz = playerZ - this.z;
            
            directions.sort((a, b) => {
                const aDist = Math.abs(dx - a.x) + Math.abs(dz - a.z);
                const bDist = Math.abs(dx - b.x) + Math.abs(dz - b.z);
                return aDist - bDist;
            });
        }

        // Try directions in order until we find one that's not blocked
        for (const dir of directions) {
            const newX = this.x + dir.x * this.speed;
            const newZ = this.z + dir.z * this.speed;
            
            if (this.canMove(newX, newZ)) {
                this.direction = dir;
                return;
            }
        }
    }

    /**
     * Check if ghost can move to position
     */
    canMove(x, z) {
        const gridPos = this.level.worldToGrid(x, z);
        return !this.level.isWall(gridPos.x, gridPos.z);
    }

    /**
     * Make ghost vulnerable
     */
    makeVulnerable(duration = 300) {
        this.isVulnerable = true;
        this.vulnerableTimer = duration;
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
        this.isVulnerable = false;
        this.vulnerableTimer = 0;
    }

    /**
     * Check collision with player
     */
    collidesWith(player) {
        const dx = this.x - player.x;
        const dz = this.z - player.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        return distance < (this.radius + player.radius);
    }
}

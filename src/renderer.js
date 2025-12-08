import * as THREE from 'three';

/**
 * Renderer class manages 3D graphics using Three.js
 */
export class Renderer {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Setup lighting
        this.setupLighting();
        
        // Setup camera
        this.camera.position.set(0, 15, 15);
        this.camera.lookAt(0, 0, 0);

        // Store references to game objects
        this.walls = [];
        this.pellets = [];
        this.playerMesh = null;
        this.ghostMeshes = [];

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Setup scene lighting
     */
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);

        // Point light for dramatic effect
        const pointLight = new THREE.PointLight(0xffcc00, 0.5);
        pointLight.position.set(0, 5, 0);
        this.scene.add(pointLight);
    }

    /**
     * Create maze walls
     */
    createMaze(level) {
        // Clear existing walls
        this.walls.forEach(wall => this.scene.remove(wall));
        this.walls = [];

        const wallGeometry = new THREE.BoxGeometry(
            level.cellSize,
            level.cellSize,
            level.cellSize
        );
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e3a8a,
            roughness: 0.7,
            metalness: 0.3
        });

        for (let row = 0; row < level.height; row++) {
            for (let col = 0; col < level.width; col++) {
                if (level.maze[row][col] === 0) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    const worldPos = level.gridToWorld(col, row);
                    wall.position.set(worldPos.x, level.cellSize / 2, worldPos.z);
                    wall.castShadow = true;
                    wall.receiveShadow = true;
                    this.scene.add(wall);
                    this.walls.push(wall);
                }
            }
        }

        // Add floor
        const floorGeometry = new THREE.PlaneGeometry(
            level.width * level.cellSize,
            level.height * level.cellSize
        );
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    /**
     * Create pellets
     */
    createPellets(level) {
        // Clear existing pellets
        this.pellets.forEach(pellet => this.scene.remove(pellet));
        this.pellets = [];

        for (let row = 0; row < level.height; row++) {
            for (let col = 0; col < level.width; col++) {
                const cell = level.maze[row][col];
                if (cell === 1 || cell === 3) {
                    const isPower = cell === 3;
                    const size = isPower ? 0.3 : 0.15;
                    const pelletGeometry = new THREE.SphereGeometry(size, 16, 16);
                    const pelletMaterial = new THREE.MeshStandardMaterial({
                        color: isPower ? 0xffff00 : 0xffffff,
                        emissive: isPower ? 0xffff00 : 0xffffff,
                        emissiveIntensity: 0.5
                    });
                    const pellet = new THREE.Mesh(pelletGeometry, pelletMaterial);
                    const worldPos = level.gridToWorld(col, row);
                    pellet.position.set(worldPos.x, 0.5, worldPos.z);
                    pellet.userData = { gridX: col, gridZ: row, isPower };
                    this.scene.add(pellet);
                    this.pellets.push(pellet);
                }
            }
        }
    }

    /**
     * Create player mesh
     */
    createPlayer(x, z) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffcc00,
            emissiveIntensity: 0.3
        });
        this.playerMesh = new THREE.Mesh(geometry, material);
        this.playerMesh.position.set(x, 0.5, z);
        this.playerMesh.castShadow = true;
        this.scene.add(this.playerMesh);
    }

    /**
     * Create ghost meshes
     */
    createGhosts(ghosts) {
        // Clear existing ghosts
        this.ghostMeshes.forEach(ghost => this.scene.remove(ghost));
        this.ghostMeshes = [];

        ghosts.forEach(ghost => {
            const geometry = new THREE.SphereGeometry(0.5, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: ghost.color,
                emissive: ghost.color,
                emissiveIntensity: 0.2
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(ghost.x, 0.5, ghost.z);
            mesh.castShadow = true;
            mesh.userData = { ghost };
            this.scene.add(mesh);
            this.ghostMeshes.push(mesh);
        });
    }

    /**
     * Update player position
     */
    updatePlayer(x, z) {
        if (this.playerMesh) {
            this.playerMesh.position.x = x;
            this.playerMesh.position.z = z;
            
            // Update camera to follow player
            this.camera.position.x = x;
            this.camera.position.z = z + 10;
            this.camera.lookAt(x, 0, z);
        }
    }

    /**
     * Update ghost positions
     */
    updateGhosts(ghosts) {
        this.ghostMeshes.forEach((mesh, index) => {
            if (ghosts[index]) {
                mesh.position.x = ghosts[index].x;
                mesh.position.z = ghosts[index].z;
                
                // Update color based on vulnerable state
                if (ghosts[index].isVulnerable) {
                    mesh.material.color.setHex(0x0000ff);
                    mesh.material.emissive.setHex(0x0000ff);
                } else {
                    mesh.material.color.setHex(ghosts[index].color);
                    mesh.material.emissive.setHex(ghosts[index].color);
                }
            }
        });
    }

    /**
     * Remove collected pellet
     */
    removePellet(gridX, gridZ) {
        const index = this.pellets.findIndex(pellet => 
            pellet.userData.gridX === gridX && pellet.userData.gridZ === gridZ
        );
        if (index !== -1) {
            this.scene.remove(this.pellets[index]);
            this.pellets.splice(index, 1);
        }
    }

    /**
     * Render the scene
     */
    render() {
        // Animate pellets
        this.pellets.forEach(pellet => {
            pellet.rotation.y += 0.02;
            pellet.position.y = 0.5 + Math.sin(Date.now() * 0.003 + pellet.userData.gridX) * 0.1;
        });

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Cleanup
     */
    dispose() {
        window.removeEventListener('resize', () => this.onWindowResize());
        this.renderer.dispose();
    }
}

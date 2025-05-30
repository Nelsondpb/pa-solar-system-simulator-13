/**
 * Represents a celestial body (planet) with orbital and rotational properties.
 * Handles planet creation, moon management, and animation.
 * @class
*/

class Planet {
    /**
       * Creates a planet instance.
       * @param {THREE.Scene} scene - Three.js scene object
       * @param {string} texturePath - Path to planetary surface texture
       * @param {number} size - Planet radius
       * @param {number} orbitRadius - Distance from central star
       * @param {number} speed - Orbital speed (radians per frame)
    */
    constructor(scene, texturePath, size, orbitRadius, speed) {
        this.scene = scene;
        this.size = size;
        this.orbitRadius = orbitRadius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.03) + 0.01;
        this.moons = [];
        this.maxMoons = 3;

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath,
            () => {},
            undefined,
            (err) => console.error('Erro ao carregar textura:', err)
        );

        this.material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.7,
            metalness: 0.2
        });

        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(size, 64, 64),
            this.material
        );
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.group = new THREE.Group();
        this.group.add(this.mesh);
        scene.add(this.group);

        if (texturePath.includes('saturn')) {
            const ringGeometry = new THREE.RingGeometry(size * 1.4, size * 2.4, 64);
            const ringMaterial = new THREE.MeshStandardMaterial({
                color: 0xdddd99,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
                roughness: 0.5
            });
            const rings = new THREE.Mesh(ringGeometry, ringMaterial);
            rings.rotation.x = Math.PI / 2;
            rings.receiveShadow = true;
            this.group.add(rings);
        }

        this.mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
    }

    /**
       * Adds a moon orbiting to this planet.
       * Automatically calculates safe orbital distance if not provided.
       * @param {THREE.Scene} scene - Three.js scene object
       * @param {string} [texturePath='./textures/moon.jpg'] - Path to moon texture
       * @param {number} [size] - Moon radius (default: 30% of planet size)
       * @param {number} [orbitRadius] - Distance from planet center (default: safe distance)
       * @param {number} [speed] - Orbital speed (default: 5x planet speed)
       * @returns {Moon|null} Created moon instance or null if moon limit reached
    */
    addMoon(scene, texturePath, size, orbitRadius, speed) {
        if (this.moons.length >= this.maxMoons) return null;

        const moonSize = size || this.size * 0.3;
        const safeOrbit = orbitRadius || (this.size + moonSize) * 3;
        const moonSpeed = speed || this.speed * 5;

        const moon = new Moon(
            this,
            scene,
            texturePath || './textures/moon.jpg',
            moonSize,
            safeOrbit,
            moonSpeed
        );

        this.moons.push(moon);
        return moon;
    }

    /**
       * Updates planet rotation and all its moons.
       * @param {number} speedMultiplier - Simulation speed adjustment factor
    */
    update(speedMultiplier) {
        this.mesh.rotation.y += this.rotationSpeed * speedMultiplier * 0.5;
        this.mesh.rotation.x += this.rotationSpeed * speedMultiplier * 0.3;

        this.moons.forEach(moon => moon.update(speedMultiplier));
    }
}
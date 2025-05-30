/**
 * Represents a moon orbiting a planet in the solar system.
 * Handles creation, positioning, and animation of moon objects.
 * @class
*/

class Moon {
    /**
       * Creates a moon instance orbiting a planet.
       * @param {Planet} parentPlanet - Parent planet object that the moon orbits
       * @param {THREE.Scene} scene - Three.js scene object
       * @param {string} texturePath - Path to moon texture file
       * @param {number} size - Radius of the moon
       * @param {number} orbitRadius - Distance from the parent planet's center
       * @param {number} speed - Orbital speed (radians per frame)
    */
    constructor(parentPlanet, scene, texturePath, size, orbitRadius, speed) {
        this.parent = parentPlanet;
        this.scene = scene;
        this.size = size;
        this.orbitRadius = orbitRadius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(
            texturePath,
            undefined,
            undefined,
            (err) => console.error('Erro ao carregar textura da lua:', err)
        );

        this.material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.7,
            metalness: 0.2
        });

        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(size, 32, 32),
            this.material
        );

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.group = new THREE.Group();
        this.group.add(this.mesh);

        this.group.position.set(
            Math.cos(this.angle) * this.orbitRadius,
            Math.sin(this.angle * 2) * (this.orbitRadius * 0.2),
            Math.sin(this.angle) * this.orbitRadius
        );

        this.parent.group.add(this.group);
    }

    /**
       * Updates the moon's orbital position and rotation.
       * Calculates new position based on elliptical orbit and applies rotation.
       * @param {number} speedMultiplier - Simulation speed adjustment factor
    */
    update(speedMultiplier) {
        this.angle += this.speed * speedMultiplier * 0.8;
        this.group.position.set(
            Math.cos(this.angle) * this.orbitRadius,
            Math.sin(this.angle * 2) * (this.orbitRadius * 0.2),
            Math.sin(this.angle) * this.orbitRadius
        );
        this.mesh.rotation.y += 0.03 * speedMultiplier;
    }
}
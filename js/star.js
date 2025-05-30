/**
 * Represents the central star (sun) in a solar system simulation.
 * Combines a textured sphere with a powerful point light source to simulate:
 * - Stellar body with surface texture;
 * - Light emission with physically correct properties;
 * - Shadow casting for the entire system;
 *
 * @class
*/

class Star {
    /**
       * Creates a star instance with configurable physical and light properties.
       * Key features:
       * - 15-unit radius sphere with high-resolution geometry (64 segments);
       * - Special sun surface texture with emissive properties;
       * - Powerful point light (intensity 150) with very large range (80,000,000 units);
       * - Optimized shadow mapping (2048x2048 resolution with custom bias);
       * - Shadow camera configured for solar system scale (near: 0.5, far: 5000);
       *
       * @param {THREE.Scene} scene - Three.js scene object
    */
    constructor(scene) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./textures/sun.jpg');

        this.material = new THREE.MeshStandardMaterial({
            map: texture,
            emissive: 0xffff33,
            emissiveIntensity: 0.4,
            roughness: 0.5,
            metalness: 0.2
        });

        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(15, 64, 64),
            this.material
        );
        this.mesh.position.set(0, 0, 0);
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = false;
        this.mesh.name = 'star';

        this.light = new THREE.PointLight(0xffffff, 150, 80000000);
        this.light.position.set(0, 0, 0);
        this.light.castShadow = true;
        this.light.shadow.mapSize.set(2048, 2048);
        this.light.shadow.bias = -0.002;
        this.light.shadow.camera.near = 0.5;
        this.light.shadow.camera.far = 5000;

        this.mesh.add(this.light);
        this.mesh.light = this.light;
        scene.add(this.mesh);
    }
}

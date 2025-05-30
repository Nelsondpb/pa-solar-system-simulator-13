/**
 * Represents a 3D model with orbital capabilities.
 * Handles loading, scaling, positioning, and animation of 3D models in the scene.
 * @class
*/

class Model3D {
    /**
       * Creates a 3D model instance.
       * @param {THREE.Scene} scene - Three.js scene object
       * @param {string} modelPath - Path to 3D model file (GLB/GLTF format)
       * @param {THREE.Vector3} [position] - Initial position (defaults to orbital position if not provided)
       * @param {number} [scale=1] - Initial scale multiplier
       * @param {number} [orbitRadius=0] - Orbital radius (0 for static objects)
       * @param {number} [speed=0.1] - Orbital speed in radians per frame
    */
    constructor(scene, modelPath, position, scale, orbitRadius = 0, speed = 0.1) {
        this.scene = scene;
        this.modelPath = modelPath;
        this.position = position || new THREE.Vector3(
            Math.cos(this.angle) * orbitRadius,
            0,
            Math.sin(this.angle) * orbitRadius * 0.7
        );
        this.scale = scale;
        this.orbitRadius = orbitRadius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.model = null;
        this.group = new THREE.Group();

        this.loadModel();
    }

    /**
       * Loads 3D model from file using GLTFLoader.
       * Applies automatic scaling to normalize model size, sets position,
       * and enables shadow casting. Handles loading errors.
    */
    loadModel() {
        const loader = new THREE.GLTFLoader();

        loader.load(
            this.modelPath,
            (gltf) => {
                this.model = gltf.scene;

                const box = new THREE.Box3().setFromObject(this.model);
                const size = new THREE.Vector3();
                box.getSize(size);

                const maxTargetSize = 5;
                const currentMaxSize = Math.max(size.x, size.y, size.z);
                this.baseScale = (maxTargetSize) / currentMaxSize;

                const totalScale = this.baseScale * this.scale;
                this.model.scale.setScalar(totalScale);
                this.model.position.set(0, 0, 0);

                this.model.castShadow = true;
                this.model.receiveShadow = true;

                this.group.add(this.model);
                this.group.position.copy(this.position);
                this.scene.add(this.group);
            },
            undefined,
            (error) => {
                console.error('Erro ao carregar o modelo:', error);
            }
        );
    }

    /**
       * Updates the model's scale while maintaining its proportions.
       * @param {number} newScale - New scale multiplier
    */
    setScale(newScale) {
        this.scale = newScale;
        if (this.model && this.baseScale) {
            const totalScale = this.baseScale * newScale;
            this.model.scale.setScalar(totalScale);
        }
    }

    /**
       * Updates model's position and rotation each frame.
       * Moves along elliptical orbit if orbital parameters are set.
       * @param {number} speedMultiplier - Simulation speed multiplier
    */
    update(speedMultiplier) {
        if (this.orbitRadius > 0 && this.speed > 0) {
            this.angle += this.speed * speedMultiplier;
            this.group.position.x = Math.cos(this.angle) * this.orbitRadius;
            this.group.position.z = Math.sin(this.angle) * this.orbitRadius * 0.7;
        }

        if (this.model) {
            this.model.rotation.y += 0.01 * speedMultiplier;
        }
    }
}
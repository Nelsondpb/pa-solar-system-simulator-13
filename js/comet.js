/**
 * Represents a comet with physical core, light emission, and dynamic particle tail.
 * Simulates realistic comet behavior including orbital movement, tail physics, and light effects.
 * @class
*/

class Comet {
    /**
       * Creates a comet instance with configurable properties.
       * @param {THREE.Scene} scene - Three.js scene object
       * @param {string} modelPath - Optional path to 3D model file (GLB format)
       * @param {number} orbitRadius - Distance from system center in world units
       * @param {number} speed - Orbital speed in radians per frame
       * @param {number} [color=0x66aaff] - Base color (hex, string, or THREE.Color)
    */
    constructor(scene, modelPath, orbitRadius, speed, color = 0x66aaff) {
        this.scene = scene;
        this.orbitRadius = orbitRadius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.tailLength = 25;

        this.group = new THREE.Group();

        this.light = new THREE.PointLight(color, 10, 500, 2);
        this.light.castShadow = true;
        this.light.shadow.mapSize = new THREE.Vector2(1024, 1024);
        this.group.add(this.light);

        const coreMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1.5,
            roughness: 0.2,
            metalness: 0.1,
            transparent: true,
            opacity: 0.6
        });
        const core = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), coreMaterial);
        this.group.add(core);

        this.scene.add(this.group);
        this.createParticles(color);

        if (modelPath) {
            new THREE.GLTFLoader().load(modelPath, (gltf) => {
                this.model = gltf.scene;
                this.model.scale.set(0.05, 0.05, 0.05);
                this.model.position.set(0, 0.5, 1);
                this.group.add(this.model);
            });
        }

        this.setColor(color);
    }

    /**
       * Creates and configures the particle system for the comet's tail.
       * @param {number} color - Tail particle color
    */
    createParticles(color) {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2;
            positions[i + 1] = (Math.random() - 0.5) * 1;
            positions[i + 2] = -Math.random() * this.tailLength * 1.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.4,
            color: color,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    /**
       * Updates comet position, tail particles, and light effects each frame.
       * @param {number} speedMultiplier - Simulation speed multiplier
    */
    update(speedMultiplier) {
        this.angle += this.speed * speedMultiplier;
        const x = Math.cos(this.angle) * this.orbitRadius;
        const z = Math.sin(this.angle) * this.orbitRadius;
        this.group.position.set(x, 0, z);

        const direction = new THREE.Vector3(
            -Math.sin(this.angle),
            0,
            Math.cos(this.angle)
        ).normalize();

        const tailOffset = direction.clone().multiplyScalar(-this.tailLength * 0.3);
        this.particleSystem.position.copy(this.group.position.clone().add(tailOffset));
        this.particleSystem.lookAt(this.group.position.clone().add(direction));

        const positions = this.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] -= speedMultiplier * 0.8;
            if (positions[i + 2] < -this.tailLength * 1.5) {
                positions[i + 2] = 0;
                positions[i] = (Math.random() - 0.5) * 2;
                positions[i + 1] = (Math.random() - 0.5) * 1;
            }
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;

        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 5) * 0.1 + 0.9;
        this.light.intensity = 8 * pulse;
    }

    /**
       * Sets unified color for all comet components.
       * @param {number} color - New color value
    */
    setColor(color) {
        this.setCoreColor(color);
        this.setTailColor(color);
    }

    /**
       * Updates color of core elements and light source.
       * @param {number} color - New core color
    */
    setCoreColor(color) {
        const newColor = new THREE.Color(color);
        this.light.color.copy(newColor);

        this.group.traverse(obj => {
            if (obj.isMesh && obj.material) {
                if (obj.material.color) obj.material.color.copy(newColor);
                if (obj.material.emissive) obj.material.emissive.copy(newColor);
            }
        });
    }

    /**
       * Updates color of tail particles.
       * @param {number} color - New tail color
    */
    setTailColor(color) {
        const newColor = new THREE.Color(color);
        if (this.particleSystem && this.particleSystem.material) {
            this.particleSystem.material.color.copy(newColor);
        }
    }

    /**
       * Orients the comet and its tail towards a specific direction.
       * @param {THREE.Vector3} vector3 - Target direction vector
    */
    setDirection(vector3) {
        this.particleSystem.lookAt(vector3);
        if (this.model) {
            this.model.lookAt(vector3);
        }
    }

    /**
       * Removes comet from scene and disposes all GPU resources.
       * Essential for memory management and preventing leaks.
    */
    dispose() {
        this.scene.remove(this.group);
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }

        if (this.model) {
            this.model.traverse(obj => {
                if (obj.isMesh) {
                    obj.geometry.dispose();
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(m => m.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
        }
    }
}

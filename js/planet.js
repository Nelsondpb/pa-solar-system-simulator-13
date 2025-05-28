class Planet {
    constructor(scene, texturePath, size, orbitRadius, speed) {
        this.scene = scene;
        this.size = size;
        this.orbitRadius = orbitRadius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshPhongMaterial({
            map: texture,
            specular: 0x111111,
            shininess: 30
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.group = new THREE.Group();
        this.group.add(this.mesh);
        scene.add(this.group);

        if (texturePath.includes('saturn')) {
            const ringGeometry = new THREE.RingGeometry(size * 1.2, size * 2.5, 32);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: 0xddddbb,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            const rings = new THREE.Mesh(ringGeometry, ringMaterial);
            rings.rotation.x = Math.PI / 2;
            this.group.add(rings);
        }
    }

    update(speedMultiplier = 1) {
        const a = this.orbitRadius;
        const b = a * 0.7;
        const eccentricity = 0.2;

        this.angle += this.speed * 0.01 * speedMultiplier;
        this.group.position.x = Math.cos(this.angle) * a * (1 - eccentricity);
        this.group.position.z = Math.sin(this.angle) * b;

        this.mesh.rotation.y += 0.01 * speedMultiplier;
    }
}
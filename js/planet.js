class Planet {
    constructor(scene, texturePath, size, orbitRadius, speed) {
        this.scene = scene;
        this.size = size;
        this.orbitRadius = orbitRadius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.03) + 0.01;

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

    update(speedMultiplier) {
        this.mesh.rotation.y += this.rotationSpeed * speedMultiplier * 0.5;
        this.mesh.rotation.x += this.rotationSpeed * speedMultiplier * 0.3;
    }
}

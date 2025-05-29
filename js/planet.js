class Planet {
    constructor(scene, texturePath, size, orbitRadius, speed) {
        this.scene = scene;
        this.size = size;
        this.orbitRadius = orbitRadius;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;


        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath, undefined, undefined, (err) => {
            console.error(`Erro ao carregar textura ${texturePath}:`, err);
        });

        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshPhongMaterial({
            map: texture,
            specular: 0x111111,
            shininess: 30,
            name: texturePath.split('/').pop() // Para debug
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
        this.mesh.rotation.y += 0.005 * speedMultiplier;
    }
}
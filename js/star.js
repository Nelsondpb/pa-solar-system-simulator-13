class Star {
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
        scene.add(this.mesh);

        this.light = new THREE.PointLight(0xffffff, 150, 80000000);
        this.light.position.set(0, 0, 0);
        this.light.castShadow = true;

        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        this.light.shadow.bias = -0.002;
        this.light.shadow.camera.near = 0.5;
        this.light.shadow.camera.far = 5000;

        scene.add(this.light);
    }
}

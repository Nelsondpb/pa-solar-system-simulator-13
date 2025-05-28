class Star {
    constructor(scene) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./textures/sun.jpg');

        this.geometry = new THREE.SphereGeometry(10, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ map: texture });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh);

        this.light = new THREE.PointLight(
            0xffffff,
            2,
            1000
        );
        scene.add(this.light);

        this.ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(this.ambientLight);
    }
}
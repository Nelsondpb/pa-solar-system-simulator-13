class Star {
    constructor(scene, size, color) {
        this.scene = scene;
        this.size = size;
        this.color = color;

        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        this.light = new THREE.PointLight(color, 1, 1000);
        this.light.position.set(0, 0, 0);
        this.scene.add(this.light);
    }
}
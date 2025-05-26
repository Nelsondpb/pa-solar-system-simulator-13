class Planet {
    constructor(scene, size, color, orbitRadius, orbitSpeed) {
        this.scene = scene;
        this.size = size;
        this.color = color;
        this.orbitRadius = orbitRadius;
        this.orbitSpeed = orbitSpeed;
        this.angle = Math.random() * Math.PI * 2;

        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 30
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.group = new THREE.Group();
        this.group.add(this.mesh);
        this.scene.add(this.group);

        this.rotationSpeed = (Math.random() * 0.02) + 0.005;
        this.rotationAngle = 0;
    }

    update(simulationSpeed) {
        this.angle += this.orbitSpeed * 0.01 * simulationSpeed;
        this.group.position.x = Math.cos(this.angle) * this.orbitRadius;
        this.group.position.z = Math.sin(this.angle) * this.orbitRadius;

        this.rotationAngle += this.rotationSpeed * simulationSpeed;
        this.mesh.rotation.y = this.rotationAngle;
    }
}
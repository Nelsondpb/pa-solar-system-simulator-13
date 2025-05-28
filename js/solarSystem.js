class SolarSystem {
    constructor(scene) {
        this.scene = scene;
        this.planets = [];
        this.speedMultiplier = 1;

        this.createSystem();
    }

    createSystem() {
        new Star(this.scene);

        this.addPlanet('./textures/earth.jpg', 5, 30, 0.5);
        this.addPlanet('./textures/mars.jpg', 3, 50, 0.3);
        this.addPlanet('./textures/jupiter.jpg', 8, 70, 0.2);
        this.addPlanet('./textures/venus.jpg', 4, 90, 0.4);
        this.addPlanet('./textures/saturn.jpg', 6, 110, 0.25);
    }

    addPlanet(texturePath, size, orbitRadius, speed) {
        const planet = new Planet(this.scene, texturePath, size, orbitRadius, speed);
        this.planets.push(planet);
    }

    update() {
        this.planets.forEach(planet => planet.update(this.speedMultiplier));
    }
}
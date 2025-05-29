class SolarSystem {
    constructor(scene) {
        this.scene = scene;
        this.planets = [];
        this.star = null;
        this.simulationSpeed = 1;
    }

    createDefaultSystem() {
        this.star = new Star(this.scene, 10, 0xffff00);

        this.addPlanet(5, 0xff0000, 20, 0.5);
        this.addPlanet(3, 0x00ff00, 35, 0.3);
        this.addPlanet(4, 0x0000ff, 50, 0.7);
        this.addPlanet(6, 0xffa500, 70, 0.2);
        this.addPlanet(2, 0xffffff, 90, 0.4);
    }

    addPlanet(size, color, orbitRadius, orbitSpeed) {
        const planet = new Planet(this.scene, size, color, orbitRadius, orbitSpeed);
        this.planets.push(planet);
        return planet;
    }

    update() {
        this.planets.forEach(planet => {
            planet.update(this.simulationSpeed);
        });
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
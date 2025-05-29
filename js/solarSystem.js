class SolarSystem {
    constructor(scene) {
        this.scene = scene;
        this.planets = [];
        this.speedMultiplier = 1;
        this.degreesPerSecond = 10;
        this.paused = false;

        this.createSystem();
        this.createUI();
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
        return planet;
    }

    update() {
        if (this.paused) return;

        const speed = THREE.MathUtils.degToRad(this.degreesPerSecond * this.speedMultiplier) / 60;

        this.planets.forEach(planet => {
            planet.angle += planet.speed * speed;
            const a = planet.orbitRadius;
            const b = a * 0.7;
            planet.group.position.x = Math.cos(planet.angle) * a * 0.8;
            planet.group.position.z = Math.sin(planet.angle) * b;

            planet.mesh.rotation.y += 0.005 * this.speedMultiplier;
        });
    }

    createUI() {
        this.uiContainer = document.createElement('div');
        this.uiContainer.style.position = 'absolute';
        this.uiContainer.style.top = '10px';
        this.uiContainer.style.left = '10px';
        this.uiContainer.style.color = 'white';
        this.uiContainer.style.fontFamily = 'Arial, sans-serif';
        this.uiContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
        this.uiContainer.style.padding = '10px';
        this.uiContainer.style.borderRadius = '5px';
        document.body.appendChild(this.uiContainer);

        const speedControlHTML = `
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px;">Velocidade: <span id="speedValue">${this.degreesPerSecond}º/s</span></label>
                <input type="range" id="speedControl" min="0" max="360" value="${this.degreesPerSecond}"
                       style="width: 200px;">
            </div>
            <div>
                <button id="pauseBtn" style="margin-right: 10px;">Pausar</button>
                <button id="resetBtn">Resetar</button>
            </div>
        `;
        this.uiContainer.innerHTML = speedControlHTML;

        // Event listeners
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.degreesPerSecond = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = `${this.degreesPerSecond}º/s`;
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.paused = !this.paused;
            document.getElementById('pauseBtn').textContent = this.paused ? 'Continuar' : 'Pausar';
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.degreesPerSecond = 10;
            document.getElementById('speedControl').value = '10';
            document.getElementById('speedValue').textContent = '10º/s';
            this.paused = false;
            document.getElementById('pauseBtn').textContent = 'Pausar';
        });
    }

    cleanup() {
        if (this.uiContainer && document.body.contains(this.uiContainer)) {
            document.body.removeChild(this.uiContainer);
        }
    }
}
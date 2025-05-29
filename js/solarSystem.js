class SolarSystem {
    constructor(scene) {
        this.scene = scene;
        this.planets = [];
        this.maxPlanets = 10;
        this.degreesPerSecond = 36;
        this.paused = false;

        this.texturesAvailable = [
            './textures/earth.jpg',
            './textures/mars.jpg',
            './textures/jupiter.jpg',
            './textures/venus.jpg',
            './textures/saturn.jpg',
            './textures/mercury.jpg',
            './textures/neptune.jpg',
            './textures/uranus.jpg',
            './textures/ceres.jpg',
            './textures/eris.jpg',
            './textures/makemake.jpg',
            './textures/venus2.jpg',
            './textures/earthnight.jpg'
        ];

        this.createSystem();
        this.createUI();
    }

    createSystem() {
        new Star(this.scene);

        this.addPlanet('./textures/mercury.jpg', 3, 30, 0.8);
        this.addPlanet('./textures/venus.jpg', 4.5, 50, 0.6);
        this.addPlanet('./textures/earth.jpg', 5, 70, 0.4);
        this.addPlanet('./textures/mars.jpg', 3.5, 90, 0.3);
        this.addPlanet('./textures/jupiter.jpg', 8, 120, 0.2);
    }

    addPlanet(texturePath = null, size = null, orbitRadius = null, speed = null) {
        if (this.planets.length >= this.maxPlanets) {
            alert('Limite máximo de 10 planetas atingido!');
            return null;
        }

        const newTexture = texturePath || this.texturesAvailable[
            Math.floor(Math.random() * this.texturesAvailable.length)
        ];
        const newSize = size || Math.random() * 4 + 2;
        const newSpeed = speed || Math.random() * 0.3 + 0.1;

        const lastOrbit = this.planets.length > 0
            ? this.planets[this.planets.length - 1].orbitRadius
            : 30;
        const safeOrbit = orbitRadius || Math.round(lastOrbit * 1.5);

        const planet = new Planet(
            this.scene,
            newTexture,
            newSize,
            safeOrbit,
            newSpeed
        );

        this.planets.push(planet);
        this.updateUI();
        return planet;
    }

    removePlanet() {
        if (this.planets.length === 0) return;

        const planet = this.planets.pop();
        this.scene.remove(planet.group);
        this.updateUI();
    }

    update() {
        if (this.paused) return;

        const angularSpeed = THREE.MathUtils.degToRad(this.degreesPerSecond) / 60;

        this.planets.forEach(planet => {
            planet.angle += planet.speed * angularSpeed;
            const a = planet.orbitRadius;
            const b = a * 0.7;
            planet.group.position.x = Math.cos(planet.angle) * a * 0.85;
            planet.group.position.z = Math.sin(planet.angle) * b;

            planet.mesh.rotation.y += planet.rotationSpeed * (this.degreesPerSecond / 60);
        });
    }

    createUI() {
        this.uiContainer = document.createElement('div');
        this.uiContainer.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: Arial;
            min-width: 250px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            z-index: 100;
            cursor: move;
        `;

        this.uiContainer.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h3 id="dragHandle" style="margin: 0 0 15px 0; color: #fff; cursor: move;"> Controles do Sistema Solar </h3>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px;">
                        Velocidade Orbital:
                        <span id="speedValue" style="color: #4CAF50;">${this.degreesPerSecond}º/s</span>
                    </label>
                    <input type="range" id="speedControl"
                           min="0" max="360" value="${this.degreesPerSecond}"
                           style="width: 100%; cursor: pointer;">
                </div>

                <div style="display: grid; gap: 10px; margin-bottom: 15px;">
                    <button id="addPlanetBtn"
                            style="padding: 10px; background: #2196F3; border: none; color: white; cursor: pointer;">
                        Adicionar Planeta (${this.planets.length}/${this.maxPlanets})
                    </button>
                    <button id="removePlanetBtn"
                            style="padding: 10px; background: #f44336; border: none; color: white; cursor: pointer;">
                        Remover Último Planeta
                    </button>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="togglePause"
                            style="flex: 1; padding: 10px; background: #FF9800; border: none; color: white; cursor: pointer;">
                        ⏸️ Pausar
                    </button>
                    <button id="resetBtn"
                            style="flex: 1; padding: 10px; background: #9E9E9E; border: none; color: white; cursor: pointer;">
                        ⟳ Resetar Sistema
                    </button>
                </div>
            </div>

            <div id="planetStatus" style="font-size: 12px; color: #BDBDBD;">
                Sistema com ${this.planets.length} planetas orbitando
            </div>
        `;

        document.body.appendChild(this.uiContainer);

        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.degreesPerSecond = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = `${e.target.value}º/s`;
        });

        document.getElementById('addPlanetBtn').addEventListener('click', () => this.addPlanet());
        document.getElementById('removePlanetBtn').addEventListener('click', () => this.removePlanet());
        document.getElementById('togglePause').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetSystem());

        this.makeDraggable(this.uiContainer);
    }

    makeDraggable(element) {
        const handle = document.getElementById('dragHandle');
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    togglePause() {
        this.paused = !this.paused;
        const btn = document.getElementById('togglePause');
        btn.textContent = this.paused ? '▶️ Continuar' : '⏸️ Pausar';
        btn.style.backgroundColor = this.paused ? '#4CAF50' : '#FF9800';
    }

    resetSystem() {
        while (this.planets.length > 0) this.removePlanet();
        this.createSystem();
        this.degreesPerSecond = 36;
        document.getElementById('speedControl').value = '36';
        document.getElementById('speedValue').textContent = '36º/s';
        this.paused = false;
        this.togglePause();
    }

    updateUI() {
        const statusElement = document.getElementById('planetStatus');
        const addButton = document.getElementById('addPlanetBtn');

        if (statusElement) {
            statusElement.textContent = `Sistema com ${this.planets.length} planeta${this.planets.length !== 1 ? 's' : ''} orbitando`;
            statusElement.style.color = this.planets.length >= this.maxPlanets ? '#FF5252' : '#BDBDBD';
        }

        if (addButton) {
            addButton.textContent = `Adicionar Planeta (${this.planets.length}/${this.maxPlanets})`;
            addButton.disabled = this.planets.length >= this.maxPlanets;
            addButton.style.backgroundColor = this.planets.length >= this.maxPlanets ? '#616161' : '#2196F3';
        }
    }

    cleanup() {
        if (this.uiContainer) {
            document.body.removeChild(this.uiContainer);
        }
        this.planets.forEach(planet => this.scene.remove(planet.group));
        this.planets = [];
    }
}

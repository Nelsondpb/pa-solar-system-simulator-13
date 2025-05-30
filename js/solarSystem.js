/**
 * Manages the entire solar system simulation including celestial bodies, UI, and interactions.
 * Handles creation, modification, and removal of planets, moons, comets, and 3D models.
 * Manages simulation state, speed, and user interface controls.
 * @class
*/

class SolarSystem {
    /**
       * Creates solar system manager.
       * @param {THREE.Scene} scene - Three.js scene object for 3D rendering
    */
    constructor(scene) {
        this.scene = scene;
        this.planets = [];
        this.maxPlanets = 10;
        this.degreesPerSecond = 36;
        this.paused = false;
        this.models = [];
        this.maxModels = 5;
        this.selectedObject = null;
        this.comets = [];
        this.maxComets = 5;
        this.cometModels = ['./models/comet.glb'];

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

        this.modelsAvailable = [
            './models/asteroid.glb',
            './models/surprise.glb',
            './models/satellite.glb',
            './models/spaceship.glb',
            './models/spacestation.glb'
        ];

        this.createUI();
        this.createSelectionUI();
        this.createSystem();
    }

    /**
       * Initializes the solar system with default celestial bodies:
       * - Central star (sun)
       * - Mercury, Venus, Earth, Mars, Jupiter
    */
    createSystem() {
        const star = new Star(this.scene);
        star.mesh.name = 'star';

        this.addPlanet('./textures/mercury.jpg', 3, 30, 0.8);
        this.addPlanet('./textures/venus.jpg', 4.5, 50, 0.6);
        this.addPlanet('./textures/earth.jpg', 5, 70, 0.4);
        this.addPlanet('./textures/mars.jpg', 3.5, 90, 0.3);
        this.addPlanet('./textures/jupiter.jpg', 8, 120, 0.2);
    }

    /**
       * Adds a new planet to the simulation with automatic safe orbit calculation.
       * @param {string} [texturePath] - Path to planet texture (random if omitted)
       * @param {number} [size] - Planet radius (random 2-6 if omitted)
       * @param {number} [orbitRadius] - Orbital distance (auto-calculated if omitted)
       * @param {number} [speed] - Orbital speed (random 0.1-0.4 if omitted)
       * @returns {Planet|null} New planet instance or null if max planets reached
    */
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
        this.updateObjectList();
        return planet;
    }

    /**
       * Adds a moon to a specified planet with default parameters.
       * @param {number} planetIndex - Index of target planet
    */
    addMoonToPlanet(planetIndex) {
        const planet = this.planets[planetIndex];
        if (planet) {
            console.log('Antes de adicionar:', {
                planetGroupChildren: planet.group.children.length,
                sceneChildren: this.scene.children.length
            });

            planet.addMoon(this.scene);

            console.log('Depois de adicionar:', {
                planetGroupChildren: planet.group.children.length,
                sceneChildren: this.scene.children.length
            });

            this.updateObjectList();
            this.showControls(`planet-${planetIndex}`);
        }
    }

    /**
       * Removes a planet and all its moons from the simulation.
       * @param {number} index - Index of planet to remove
    */
    removePlanet(index) {
            if (index >= 0 && index < this.planets.length) {
                this.scene.remove(this.planets[index].group);
                this.planets.splice(index, 1);
                this.updateUI();
                this.updateObjectList();
            }
        }

    /**
       * Removes the last moon from a specified planet.
       * @param {number} planetIndex - Index of target planet
    */
    removeMoonFromPlanet(planetIndex) {
        const planet = this.planets[planetIndex];
        if (planet && planet.moons.length > 0) {
            const moon = planet.moons.pop();

            moon.group.parent.remove(moon.group);
            moon.mesh.geometry.dispose();
            moon.material.dispose();

            this.updateObjectList();
            this.showControls(`planet-${planetIndex}`);
        }
    }

    /**
       * Adds a 3D model to the simulation with optional orbital parameters.
       * @param {string} modelPath - Path to 3D model file (GLB format)
       * @param {THREE.Vector3} [position] - Initial position (random if omitted)
       * @param {number} [scale=1] - Scaling factor
       * @param {number} [orbitRadius=0] - Orbital radius (0 for static objects)
       * @param {number} [speed=0.1] - Orbital speed
       * @returns {Model3D|null} New model instance or null if max models reached
    */
    addModel(modelPath, position = null, scale = 1, orbitRadius = 0, speed = 0.1) {
        if (this.models.length >= this.maxModels) {
            alert('Limite máximo de 5 modelos atingido!');
            return null;
        }

        const newPosition = position || new THREE.Vector3(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 100
        );

        const model = new Model3D(
            this.scene,
            modelPath,
            newPosition,
            scale,
            orbitRadius,
            speed
        );

        this.models.push(model);
        this.updateUI();
        this.updateObjectList();
        return model;
    }

    /**
       * Removes a 3D model from the simulation.
       * @param {number} index - Index of model to remove
    */
    removeModel(index) {
            if (index >= 0 && index < this.models.length) {
                this.scene.remove(this.models[index].group);
                this.models.splice(index, 1);
                this.updateUI();
                this.updateObjectList();
            }
    }

    /**
       * Adds a new comet with automatically calculated orbit outside existing planets.
       * Uses default comet model and randomized parameters.
    */
    addComet() {
        if (this.comets.length >= this.maxComets) {
            alert('Limite máximo de cometas atingido!');
            return;
        }

        let maxOrbit = 150;
        if (this.planets.length > 0) {
            maxOrbit = this.planets[this.planets.length - 1].orbitRadius * 1.5;
        }
        if (this.comets.length > 0) {
            maxOrbit = Math.max(maxOrbit, this.comets[this.comets.length - 1].orbitRadius * 1.2);
        }

        const comet = new Comet(
            this.scene,
            this.cometModels[0],
            maxOrbit,
            Math.random() * 0.2 + 0.1
        );

        this.comets.push(comet);
        this.updateObjectList();
        this.updateUI();
    }

    /**
       * Updates comet color.
       * @param {number} index - Comet index
       * @param {string} color - New color value
    */
    updateCometColor(index, color) {
        if (this.comets[index]) {
            this.comets[index].setTailColor(new THREE.Color(color));
        }
    }

    /**
       * Updates the orbital speed of a comet.
       * @param {number} index - Comet index
       * @param {number} speed - New orbital speed
    */
    updateCometSpeed(index, speed) {
        if (this.comets[index]) {
            this.comets[index].speed = parseFloat(speed);
        }
    }

    /**
       * Removes a comet and cleans up its resources.
       * @param {number} index - Comet index
    */
    removeComet(index) {
        if (index >= 0 && index < this.comets.length) {
            this.comets[index].dispose();

            if (this.comets[index].model) {
                this.comets[index].model.traverse(child => {
                    if (child.isMesh) {
                        child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(m => m.dispose());
                            } else {
                                child.material.dispose();
                            }
                        }
                    }
                });
            }

            this.comets.splice(index, 1);
            this.updateObjectList();
            this.updateUI();
        }
    }

    /**
       * Updates positions and rotations of all simulation objects.
       * Handles planetary orbits, model movements, and comet animations.
       * Respects pause state and simulation speed.
    */
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

        this.models.forEach(model => {
            model.update(angularSpeed);
        });

        this.comets.forEach(comet => comet.update(angularSpeed));

    }

    /**
       * Creates the object selection UI panel (right panel).
       * Contains dropdown selector and dynamic controls.
    */
    createSelectionUI() {
        this.selectionContainer = document.createElement('div');
        this.selectionContainer.id = 'selectionContainer';
        this.selectionContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            min-width: 250px;
            z-index: 100;
        `;

            this.selectionContainer.innerHTML = `
                <h3 style="margin:0 0 10px 0; color: #4CAF50;">Seleção de Objetos</h3>
                <select id="objectSelector" style="width:100%; margin-bottom:10px; padding:5px;">
                    <option value="">Selecione um objeto...</option>
                </select>
                <div id="objectControls"></div>
            `;

            document.body.appendChild(this.selectionContainer);
            document.getElementById('objectSelector').addEventListener('change', (e) => this.showControls(e.target.value));
        }

    /**
       * Populates the object selector dropdown with current celestial bodies.
       * Includes star, planets, models, and comets with proper indexing.
    */
    updateObjectList() {
            const selector = document.getElementById('objectSelector');
            if (!selector) return;
            selector.innerHTML = '<option value="">Selecione um objeto...</option>';

            selector.innerHTML += `<option value="star-0">Sol</option>`;

            this.planets.forEach((planet, index) => {
                selector.innerHTML += `<option value="planet-${index}"> Planeta ${index + 1}</option>`;
            });

            this.models.forEach((model, index) => {
                selector.innerHTML += `<option value="model-${index}"> Modelo ${index + 1}</option>`;
            });

            this.comets.forEach((comet, index) => {
                selector.innerHTML += `<option value="comet-${index}"> Cometa ${index + 1}</option>`;
            });
    }

    /**
       * Displays context-sensitive controls for the selected object.
       * @param {string} objectId - Object identifier in "type-index" format
    */
    showControls(objectId) {
                const controlsContainer = document.getElementById('objectControls');
                controlsContainer.innerHTML = '';
                this.selectedObject = null;

                if (!objectId) return;

                const [type, index] = objectId.split('-');
                const controls = {
                    common: `
                        <button onclick="window.solarSystem.removeObject('${objectId}')"
                                style="width:100%; margin:5px 0; background:#f44336;">
                            Remover
                        </button>
                    `
                };

                switch(type) {
                    case 'star':
                        this.selectedObject = this.scene.getObjectByName('star');
                        controlsContainer.innerHTML = `
                            <div class="control-group">
                                <label> Intensidade da Luz </label>
                                <input type="range" min="0" max="500" value="${this.selectedObject?.light.intensity || 150}"
                                    oninput="window.solarSystem.updateLightIntensity(this.value)"
                                    style="width:100%;">
                            </div>
                        `;
                        break;

                    case 'planet':
                        this.selectedObject = this.planets[index];
                        controlsContainer.innerHTML = `
                            ${controls.common}
                            <div class="control-group">
                                <label> Luas (${this.selectedObject.moons.length}/${this.selectedObject.maxMoons}) </label>
                                <button onclick="window.solarSystem.addMoonToPlanet(${index})" style="width:48%; background:#2196F3;"
                                ${this.selectedObject.moons.length >= this.selectedObject.maxMoons ? 'disabled' : ''}> + Lua </button>
                                 <button onclick="window.solarSystem.removeMoonFromPlanet(${index})" style="width:48%; background:#f44336;"
                                 ${this.selectedObject.moons.length === 0 ? 'disabled' : ''}>  - Lua
                                    </button>
                            </div>
                            <div class="control-group">
                                <label> Velocidade Orbital </label>
                                <input type="range" min="0" max="2" step="0.01" value="${this.selectedObject.speed}"
                                    oninput="window.solarSystem.updatePlanetSpeed(${index}, this.value)"
                                    style="width:100%;">
                            </div>
                            <div class="control-group">
                                <label> Escala </label>
                                <input type="range" min="0.1" max="5" step="0.1" value="${this.selectedObject.size}"
                                    oninput="window.solarSystem.updatePlanetScale(${index}, this.value)"
                                    style="width:100%;">
                            </div>
                            <div class="rotation-controls">
                                <div class="control-group">
                                    <label> Rotação X </label>
                                    <input type="range" min="0" max="6.28" step="0.01"
                                        value="${this.selectedObject.mesh.rotation.x}"
                                        oninput="window.solarSystem.updatePlanetRotation(${index}, 'x', this.value)"
                                        style="width:100%;">
                                </div>
                                <div class="control-group">
                                    <label> Rotação Y </label>
                                    <input type="range" min="0" max="6.28" step="0.01"
                                        value="${this.selectedObject.mesh.rotation.y}"
                                        oninput="window.solarSystem.updatePlanetRotation(${index}, 'y', this.value)"
                                        style="width:100%;">
                                </div>
                                <div class="control-group">
                                    <label> Rotação Z </label>
                                    <input type="range" min="0" max="6.28" step="0.01"
                                        value="${this.selectedObject.mesh.rotation.z}"
                                        oninput="window.solarSystem.updatePlanetRotation(${index}, 'z', this.value)"
                                        style="width:100%;">
                                </div>
                            </div>
                            <div class="control-group">
                                <label> Textura </label>
                                <select onchange="window.solarSystem.updatePlanetTexture(${index}, this.value)"
                                        style="width:100%;">
                                    ${this.texturesAvailable.map(texture => `
                                        <option value="${texture}" ${texture === this.selectedObject.material.map.image.currentSrc ? 'selected' : ''}>
                                            ${texture.split('/').pop().split('.')[0]}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        `;
                        break;

                    case 'model':
                        this.selectedObject = this.models[index];
                        controlsContainer.innerHTML = `
                            ${controls.common}
                            <div class="control-group">
                                <label> Velocidade Orbital </label>
                                <input type="range" min="0" max="2" step="0.01" value="${this.selectedObject.speed}"
                                    oninput="window.solarSystem.updateModelSpeed(${index}, this.value)"
                                    style="width:100%;">
                            </div>
                            <div class="control-group">
                                <label> Escala </label>
                                <input type="range" min="0.1" max="5" step="0.1" value="${this.selectedObject.scale}"
                                    oninput="window.solarSystem.updateModelScale(${index}, this.value)"
                                    style="width:100%;">
                            </div>
                            <div class="rotation-controls">
                                <div class="control-group">
                                    <label> Rotação X </label>
                                    <input type="range" min="0" max="6.28" step="0.01"
                                        value="${this.selectedObject.model?.rotation.x || 0}"
                                        oninput="window.solarSystem.updateModelRotation(${index}, 'x', this.value)"
                                        style="width:100%;">
                                </div>
                                <div class="control-group">
                                    <label> Rotação Y </label>
                                    <input type="range" min="0" max="6.28" step="0.01"
                                        value="${this.selectedObject.model?.rotation.y || 0}"
                                        oninput="window.solarSystem.updateModelRotation(${index}, 'y', this.value)"
                                        style="width:100%;">
                                </div>
                                <div class="control-group">
                                    <label> Rotação Z </label>
                                    <input type="range" min="0" max="6.28" step="0.01"
                                        value="${this.selectedObject.model?.rotation.z || 0}"
                                        oninput="window.solarSystem.updateModelRotation(${index}, 'z', this.value)"
                                        style="width:100%;">
                                </div>
                            </div>
                            <div class="control-group">
                                <label> Modelo </label>
                                <select onchange="window.solarSystem.updateModelFile(${index}, this.value)"
                                        style="width:100%;">
                                    ${this.modelsAvailable.map(path => `
                                        <option value="${path}" ${path === this.selectedObject.modelPath ? 'selected' : ''}>
                                            ${path.split('/').pop().replace('.glb', '')}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        `;
                        break;

                    case 'comet':
                        this.selectedObject = this.comets[index];
                        controlsContainer.innerHTML = `
                            <div class="control-group">
                                <label> Cor da Luz </label>
                                <input type="color" value="#${this.selectedObject.light.color.getHexString()}"
                                    onchange="window.solarSystem.updateCometColor(${index}, this.value)"
                                    style="width:100%;">
                            </div>
                            <div class="control-group">
                                <label> Velocidade Orbital </label>
                                <input type="range" min="0" max="1" step="0.01" value="${this.selectedObject.speed}"
                                    oninput="window.solarSystem.updateCometSpeed(${index}, this.value)"
                                    style="width:100%;">
                            </div>
                        `;
                        break;
                }
    }

    /**
       * Updates the star light intensity and emissive properties.
       * @param {number} value - New light intensity (0-500)
    */
    updateLightIntensity(value) {
                const star = this.scene.getObjectByName('star');
                if (star) {
                    star.light.intensity = parseFloat(value);
                    star.material.emissiveIntensity = parseFloat(value) / 150;
                }
    }

    /**
       * Updates planet orbital speed.
       * @param {number} index - Planet index
       * @param {number} speed - New orbital speed
    */
    updatePlanetSpeed(index, speed) {
                if (this.planets[index]) {
                    this.planets[index].speed = parseFloat(speed);
                }
    }

    /**
       * Updates a planet's size and recreates its geometry.
       * @param {number} index - Planet index
       * @param {number} scale - New size (radius)
    */
    updatePlanetScale(index, scale) {
                const planet = this.planets[index];
                if (planet) {
                    planet.size = parseFloat(scale);
                    planet.mesh.geometry.dispose();
                    planet.mesh.geometry = new THREE.SphereGeometry(planet.size, 64, 64);
                }
    }

    /**
       * Updates a planet's rotation around a specific axis.
       * @param {number} index - Planet index
       * @param {string} axis - Rotation axis ('x','y','z')
       * @param {number} value - Rotation angle in radians
    */
    updatePlanetRotation(index, axis, value) {
                const planet = this.planets[index];
                if (planet) {
                    planet.mesh.rotation[axis] = parseFloat(value);
                }
    }

    /**
       * Updates a planet's surface texture.
       * @param {number} index - Planet index
       * @param {string} texturePath - Path to new texture
    */
    updatePlanetTexture(index, texturePath) {
                const planet = this.planets[index];
                if (planet) {
                    const textureLoader = new THREE.TextureLoader();
                    textureLoader.load(texturePath, (texture) => {
                        planet.material.map = texture;
                        planet.material.needsUpdate = true;
                    });
                }
    }

    /**
       * Updates model orbital speed.
       * @param {number} index - Model index
       * @param {number} speed - New orbital speed
    */
    updateModelSpeed(index, speed) {
                const model = this.models[index];
                if (model) {
                    model.speed = parseFloat(speed);
                }
    }

    /**
       * Updates a model scale while maintaining proportions.
       * @param {number} index - Model index
       * @param {number} scale - New scale factor
    */
    updateModelScale(index, scale) {
                const model = this.models[index];
                if (model) {
                    model.setScale(parseFloat(scale));
                }
    }

    /**
       * Updates a model's rotation around a specific axis.
       * @param {number} index - Model index
       * @param {string} axis - Rotation axis ('x','y','z')
       * @param {number} value - Rotation angle in radians
    */
    updateModelRotation(index, axis, value) {
                const model = this.models[index];
                if (model && model.model) {
                    model.model.rotation[axis] = parseFloat(value);
                }
    }

    /**
       * Changes a model's 3D file while preserving its transform properties.
       * @param {number} index - Model index
       * @param {string} modelPath - Path to new 3D model
    */
    updateModelFile(index, modelPath) {
                const model = this.models[index];
                if (model) {
                    const position = model.group.position.clone();
                    const rotation = model.model ? model.model.rotation.clone() : new THREE.Euler();
                    const scale = model.scale;
                    const orbitRadius = model.orbitRadius;
                    const speed = model.speed;

                    this.scene.remove(model.group);
                    this.models.splice(index, 1);

                    const newModel = this.addModel(modelPath, position, scale, orbitRadius, speed);

                    const waitForModel = () => {
                        if (newModel.model) {
                            newModel.model.rotation.copy(rotation);
                        } else {
                            requestAnimationFrame(waitForModel);
                        }
                    };

                    waitForModel();

                    this.showControls(`model-${this.models.length - 1}`);
                }
    }

    /**
       * Removes any simulation object based on its identifier.
       * @param {string} objectId - Object identifier in "type-index" format
    */
    removeObject(objectId) {
                const [type, index] = objectId.split('-');
                switch(type) {
                    case 'planet':
                        this.removePlanet(parseInt(index));
                        break;
                    case 'model':
                        this.removeModel(parseInt(index));
                        break;
                    case 'comet':
                        this.removeComet(parseInt(index));
                        break;
                }
    }

    /**
       * Creates the main control UI panel (left panel).
       * Contains simulation controls, object creation buttons, and status display.
    */
    createUI() {
        this.uiContainer = document.createElement('div');
        this.uiContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 350px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: Arial;
            min-width: 250px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            z-index: 100;
        `;


        this.uiContainer.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h3 id="dragHandle" style="margin: 0 0 15px 0; color: #fff;"> Controles do Sistema Solar </h3>

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

                <div style="margin-top: 20px; border-top: 1px solid #333; padding-top: 15px;">
                    <h4 id="modelTitle" style="margin: 0 0 10px 0; color: #9C27B0;">
                        Modelos 3D (${this.models.length}/${this.maxModels})
                    </h4>

                    <div style="display: grid; gap: 10px; margin-bottom: 15px;">
                        <button id="addAsteroidBtn"
                                style="padding: 8px; background: #9C27B0; border: none; color: white; cursor: pointer;">
                            Adicionar Asteroide
                        </button>
                        <button id="addSurpriseBtn"
                                style="padding: 8px; background: #9C27B0; border: none; color: white; cursor: pointer;">
                            Adicionar Surpresa
                        </button>
                        <button id="addSatelliteBtn"
                                style="padding: 8px; background: #9C27B0; border: none; color: white; cursor: pointer;">
                            Adicionar Satélite
                        </button>
                        <button id="addSpaceshipBtn"
                                style="padding: 8px; background: #9C27B0; border: none; color: white; cursor: pointer;">
                            Adicionar Nave
                        </button>
                        <button id="addStationBtn"
                                style="padding: 8px; background: #9C27B0; border: none; color: white; cursor: pointer;">
                            Adicionar Estação
                        </button>
                        <button id="removeModelBtn"
                                style="padding: 8px; background: #7B1FA2; border: none; color: white; cursor: pointer;">
                             Remover Último Modelo
                        </button>
                        <button id="addCometBtn"
                                style="padding: 8px; background: #FF5722; border: none; color: white; cursor: pointer;">
                            Adicionar Cometa (${this.comets.length}/${this.maxComets})
                        </button>
                        <button id="removeCometBtn"
                                        style="padding: 8px; background: #FF7043; border: none; color: white; cursor: pointer;">
                                    Remover Último Cometa
                        </button>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 15px;">
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
                Sistema com ${this.planets.length} planetas e ${this.models.length} modelos
            </div>
        `;

        document.body.appendChild(this.uiContainer);

        this.updateObjectList();

        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.degreesPerSecond = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = `${e.target.value}º/s`;
        });

        document.getElementById('addPlanetBtn').addEventListener('click', () => this.addPlanet());
        document.getElementById('removePlanetBtn').addEventListener('click', () => {
            if (this.planets.length > 0) this.removePlanet(this.planets.length - 1);
        });

        document.getElementById('addAsteroidBtn').addEventListener('click', () =>
            this.addModel('./models/asteroid.glb', null, 1.5, 100, 0.06));

        document.getElementById('addSurpriseBtn').addEventListener('click', () =>
            this.addModel('./models/surprise.glb', null, 2, 110, 0.1));

        document.getElementById('addSatelliteBtn').addEventListener('click', () =>
            this.addModel('./models/satellite.glb', null, 1.2, 120, 0.04));

        document.getElementById('addSpaceshipBtn').addEventListener('click', () =>
            this.addModel('./models/spaceship.glb', null, 1.6, 130, 0.07));

        document.getElementById('addStationBtn').addEventListener('click', () =>
            this.addModel('./models/spacestation.glb', null, 2, 140, 0.03));

        document.getElementById('addCometBtn').addEventListener('click', () => this.addComet());

        document.getElementById('removeCometBtn').addEventListener('click', () => {
            if (this.comets.length > 0) this.removeComet(this.comets.length - 1);
        });

        document.getElementById('removeModelBtn').addEventListener('click', () => {
            if (this.models.length > 0) this.removeModel(this.models.length - 1);
        });

        document.getElementById('togglePause').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetSystem());

    }

    /**
       * Toggles the simulation pause state and updates button appearance.
    */
    togglePause() {
        this.paused = !this.paused;
        const btn = document.getElementById('togglePause');
        btn.textContent = this.paused ? '▶️ Continuar' : '⏸️ Pausar';
        btn.style.backgroundColor = this.paused ? '#4CAF50' : '#FF9800';
    }

    /**
       * Clears all celestial bodies from the simulation.
       * Removes planets, models, and comets from the scene.
    */
    clearSystem() {
        this.planets.forEach(planet => {
            this.scene.remove(planet.group);
        });
        this.models.forEach(model => {
            this.scene.remove(model.group);
        });
        this.comets.forEach(comet => {
            this.scene.remove(comet.group);
        });

        this.planets = [];
        this.models = [];
        this.comets = [];

        this.updateUI();
        this.updateObjectList();
    }

    /**
       * Resets the simulation to its initial state.
       * - Clears current system
       * - Creates default solar system
       * - Resets simulation speed to 36°/s
       * - Ensures simulation is unpaused
    */
    resetSystem() {
       this.clearSystem();
       this.createSystem();

       this.degreesPerSecond = 36;
       document.getElementById('speedControl').value = '36';
       document.getElementById('speedValue').textContent = '36º/s';

       if (this.paused) this.togglePause();

   }

    /**
       * Updates all UI elements to reflect current simulation state.
       * - Updates object counters
       * - Adjusts button states (enabled/disabled)
       * - Refreshes status text
    */
    updateUI() {
        if (!this.uiContainer) return;

        const statusElement = document.getElementById('planetStatus');
        const addPlanetButton = document.getElementById('addPlanetBtn');
        const modelTitle = document.getElementById('modelTitle');
        const addCometButton = document.getElementById('addCometBtn');


        if (statusElement) {
            statusElement.textContent = `Sistema com ${this.planets.length} planeta${this.planets.length !== 1 ? 's' : ''} e ${this.models.length} modelo${this.models.length !== 1 ? 's' : ''}`;
        }

        if (addPlanetButton) {
            addPlanetButton.textContent = `Adicionar Planeta (${this.planets.length}/${this.maxPlanets})`;
            addPlanetButton.disabled = this.planets.length >= this.maxPlanets;
            addPlanetButton.style.backgroundColor = this.planets.length >= this.maxPlanets ? '#616161' : '#2196F3';
        }

        if (modelTitle) {
            modelTitle.textContent = `Modelos 3D (${this.models.length}/${this.maxModels})`;
        }

            if (addCometBtn) {
                    addCometBtn.textContent = `Adicionar Cometa (${this.comets.length}/${this.maxComets})`;
                    addCometBtn.disabled = this.comets.length >= this.maxComets;
                    addCometBtn.style.backgroundColor = this.comets.length >= this.maxComets ? '#616161' : '#FF5722';
                }

            if (statusElement) {
                    statusElement.textContent = `Sistema com ${this.planets.length} planetas, ${this.models.length} modelos e ${this.comets.length} cometas`;
                }
    }

    /**
       * Cleans up resources when destroying the simulation.
       * Removes UI elements and clears scene objects.
    */
    cleanup() {
        if (this.uiContainer) {
            document.body.removeChild(this.uiContainer);
        }
        this.planets.forEach(planet => this.scene.remove(planet.group));
        this.models.forEach(model => this.scene.remove(model.group));
        this.planets = [];
        this.models = [];
    }
}
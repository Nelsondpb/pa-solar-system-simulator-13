/**
 * Main application controller for solar system simulation.
 * Handles scene initialization, controls setup, and animation loop.
 * @class
*/

class SolarSystemSimulator {
    /**
       * Initializes the solar system simulator.
       * Sets up the scene, solar system, controls, and starts the animation loop.
    */
    constructor() {
        this.keyStates = {};
        this.initScene();
        this.initSolarSystem();
        this.initControls();
        this.initPerformance();
        this.animate();
    }

    /**
       * Sets up Three.js scene, camera, and renderer.
       * Configures scene background, fog, camera position, ambient light, and renderer settings.
    */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x00001A);
        this.scene.fog = new THREE.FogExp2(0x000000, 0.0005);

        this.camera = new THREE.PerspectiveCamera(75, 800 / 800, 1, 5000);
        this.camera.position.set(0, 100, 200);
        this.camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        this.scene.add(ambientLight);


        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('glCanvas'),
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(800, 800);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.physicallyCorrectLights = true;
    }

    /**
       * Creates initial solar system objects.
       * Instantiates the SolarSystem class and checks for GLTFLoader availability.
    */
    initSolarSystem() {
        this.solarSystem = new SolarSystem(this.scene);
        window.solarSystem = this.solarSystem;
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('GLTFLoader não está disponível');
        }
    }

    /**
       * Configures user input controls.
       * Sets up both orbit controls and pointer lock (FPS) controls.
       * Handles keyboard input for movement and mode toggling.
    */
    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.fpsControls = new PointerLockControls(this.camera, document.body);
        this.scene.add(this.fpsControls.getObject());

        this.isFPS = false;

        document.body.addEventListener('click', () => {
            if (this.isFPS) this.fpsControls.lock();
        });

        window.addEventListener('keydown', (e) => {
            this.keyStates[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === 'm') {
                this.toggleControlMode();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keyStates[e.key.toLowerCase()] = false;
        });
    }

    /**
       * Toggles between orbit and first-person controls.
    */
    toggleControlMode() {
        this.isFPS = !this.isFPS;
        if (this.isFPS) {
            this.controls.enabled = false;
            this.fpsControls.lock();
        } else {
            this.controls.enabled = true;
            this.fpsControls.unlock();
        }
    }

    /**
       * Initializes performance monitoring using the Stats library.
       * Adds the stats panel to the document if available.
    */
    initPerformance() {
        if (typeof Stats !== 'undefined') {
            this.stats = new Stats();
            this.stats.showPanel(0);
            document.body.appendChild(this.stats.dom);
        }
    }

    /**
       * Main animation and rendering loop.
       * Updates controls, handles camera movement based on user input,
       * updates the solar system, and renders the scene.
       * Also updates performance stats if enabled.
    */
    animate() {
        requestAnimationFrame(() => this.animate());

        this.controls.update();

        if (!this.solarSystem.paused) {
            const cameraSpeed = 3;

            if (this.isFPS) {
                const direction = new THREE.Vector3();
                if (this.keyStates['w']) direction.z -= 1;
                if (this.keyStates['s']) direction.z += 1;
                if (this.keyStates['a']) direction.x -= 1;
                if (this.keyStates['d']) direction.x += 1;
                if (this.keyStates['q']) direction.y += 1;
                if (this.keyStates['r']) direction.y -= 1;

                direction.normalize();
                direction.applyQuaternion(this.camera.quaternion);
                this.fpsControls.getObject().position.addScaledVector(direction, cameraSpeed);
            } else {
                if (this.keyStates['w']) this.camera.position.z -= cameraSpeed;
                if (this.keyStates['s']) this.camera.position.z += cameraSpeed;
                if (this.keyStates['a']) this.camera.position.x -= cameraSpeed;
                if (this.keyStates['d']) this.camera.position.x += cameraSpeed;
                if (this.keyStates['q']) this.camera.position.y += cameraSpeed;
                if (this.keyStates['r']) this.camera.position.y -= cameraSpeed;
                this.controls.update();
            }

            this.solarSystem.update();
        }

        this.renderer.render(this.scene, this.camera);

        if (this.stats) this.stats.update();
    }
}

/**
 * Handles the window load event to start the simulation.
 * Checks for WebGL support, initializes the SolarSystemSimulator,
 * and hides the loader. Displays an error message if WebGL is not supported
 * or if initialization fails.
*/
window.addEventListener('load', () => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) throw new Error('WebGL não suportado neste navegador');

        new SolarSystemSimulator();

        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';

    } catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #d32f2f; color: white;
            padding: 20px; border-radius: 8px;
            text-align: center; max-width: 90%;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            z-index: 10000;
        `;
        errorDiv.innerHTML = `
            <h3 style="margin:0 0 15px 0;"> Erro Fatal </h3>
            <p style="margin:0 0 10px 0;">${error.message}</p>
            <small> Verifique o console para detalhes técnicos </small>
        `;
        document.body.appendChild(errorDiv);

        console.error("Erro de inicialização:", error);
    }
});
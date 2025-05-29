class SolarSystemSimulator {
    constructor() {
        this.initScene();
        this.initSolarSystem();
        this.initControls();
        this.initPerformance();
        this.animate();
    }

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



    initSolarSystem() {
        this.solarSystem = new SolarSystem(this.scene);
        window.solarSystem = this.solarSystem;
    }

    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 30;
        this.controls.maxDistance = 1500;
        this.controls.maxPolarAngle = Math.PI * 0.95;

        this.keyStates = {};
        window.addEventListener('keydown', (e) => this.keyStates[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.keyStates[e.key.toLowerCase()] = false);
    }

    initPerformance() {
        if (typeof Stats !== 'undefined') {
            this.stats = new Stats();
            this.stats.showPanel(0);
            document.body.appendChild(this.stats.dom);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.controls.update();

        if (!this.solarSystem.paused) {
            const cameraSpeed = 3;
            if (this.keyStates['w']) this.camera.position.z -= cameraSpeed;
            if (this.keyStates['s']) this.camera.position.z += cameraSpeed;
            if (this.keyStates['a']) this.camera.position.x -= cameraSpeed;
            if (this.keyStates['d']) this.camera.position.x += cameraSpeed;

            this.solarSystem.update();
        }

        this.renderer.render(this.scene, this.camera);

        if (this.stats) this.stats.update();
    }
}

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
            <h3 style="margin:0 0 15px 0;">Erro Fatal</h3>
            <p style="margin:0 0 10px 0;">${error.message}</p>
            <small>Verifique o console para detalhes técnicos</small>
        `;
        document.body.appendChild(errorDiv);

        console.error("Erro de inicialização:", error);
    }
});